# global Sunny var
`
Sunny = {};
simport = function(sunny_pkg) {
  Sunny.simport(this, sunny_pkg);
}
`

# -----------------------------

Array.prototype.find = (cb) ->
  for e in this
    return e if cb(e)
  return undefined
              
# -----------------------------

Sunny.simport = (context, sunnyPkg) ->
  return unless sunnyPkg? and sunnyPkg.__exports__?
  for name in sunnyPkg.__exports__
    context[name] = sunnyPkg[name]

Sunny.simportAll = (context, sunny_pkg) ->
  for name, value of sunny_pkg
    context[name] = value

# -----------------------------------------------
# types
# -----------------------------------------------

Sunny.Types = do ->
  class Klass
    constructor: (@name, @primitive, @constrFn, @defaultValue) ->
        
  class Type
    constructor: (@mult, @klasses) ->

    isScalar: () ->
      @mult == "one" || @mult == "lone" || not @mult

    isUnary: () ->
      @klasses.length == 1

    isPrimitive: () ->
      this.isUnary() && @klasses[0].primitive

    defaultValue: () ->
      if not this.isScalar()
        return []
      else if @klasses.length > 1
        return []
      else
        return @klasses[0].defaultValue

  __exports__ : ["Int", "Bool", "Text"]

  Klass     : Klass 
  Type      : Type
  Int       : new Klass "Int", true, 0
  Bool      : new Klass "Bool", true, false
  Text      : new Klass "Text", true, null
  isKlass   : (fn) -> typeof(fn) == "function" and fn.__meta__?
  asType    : (x) -> if x instanceof Type
                       return x
                     else if x instanceof Klass
                       return new Type("one", [x])
                     else if typeof(x) == "string"
                       return new Type("one", [new Klass(x)])
                     else if Sunny.Types.isKlass(x)
                       return new Type("one", [x.__meta__.klass])
                     else
                       return null

# -----------------------------------------------

findFieldByName = (fields, name) -> fields.find((f) -> f.name == name)

convertMeteorObj = (sunnyCls, meteorObj) ->
  if not meteorObj
    return meteorObj
  else
    return new sunnyCls(meteorObj)

convertMeteorObjId = (sunnyCls, objId) ->
  meteorObj = sunnyCls.__meta__.__repr__.findOne(objId);
  return convertMeteorObj(sunnyCls, meteorObj);

convertMeteorArray = (sunnyCls, arr, elemMapFn) ->
  mapFn = elemMapFn || convertMeteorObj
  ans = []
  ans.push(mapFn(sunnyCls, e)) for e in arr
  return ans

wrap = (obj, fld, val) ->
  if fld.type.isScalar()
    return val
  else
    if not val
      val = []
      obj.writeField(fld.name, val)
    throw("field #{fld.name} in #{obj} has no type") unless fld.type
    throw("field #{fld.name} in #{obj} is not unary") unless fld.type.isUnary()
    ans = convertMeteorArray(fld.type.klasses[0].constrFn, val, convertMeteorObjId)
    return createSunnyArray(obj, fld, ans)

createSunnyArray = (sunnyOwnerObj, sunnyFld, array) ->
  ans = array || []
  ans.super = {}
  ans.__sunny__ = { owner: sunnyOwnerObj, field: sunnyFld }
  for pn, pv of Sunny.Model.SunnyArrayExt.prototype
    ans[pn] = pv
  for pn in Object.getOwnPropertyNames(Array.prototype)
    pv = Array.prototype[pn]
    pv = pv.bind(ans) if typeof(pv) == "function"
    ans.super[pn] = pv
  return ans

Sunny.Model = do ->
  Sig:        class Sig
                meta: -> this.constructor.__meta__
                
  Record:     class Record extends Sig
                constructor: (props) ->
                  Object.defineProperty(this, '__props__', {enumerable:false , value:{}})
                  for fld in this.meta().allFields()
                    this.__props__[fld.name] = fld.type.defaultValue()
                  this.__props__[pn] = pv for pn, pv of props

                id: () ->
                  this.__props__._id

                readField: (fldName, opts) ->
                  fld = this.meta().field(fldName)
                  if not fld
                    throw("field '#{fldName}' not found in '#{this.meta().name}'")
                  if not this.__props__
                    return fld.type

                  obj = this.meta().__repr__.findOne(this.id())
                  if not obj
                    throw("object with id = '#{this.id()}' doesn't exist anymore")
                  ans = obj[fldName]
                  this.__props__[fldName] = ans
                  return wrap(this, fld, ans)

                writeField: (fldName, fldValue, opts) ->
                  this.__props__[fldName] = fldValue
                  mod = {}
                  mod[fldName] = fldValue
                  this.meta().__repr__.update(
                    {  _id: this.id() },
                    { $set: mod }
                  )
                  return this

                __static__: {
                    create: (objProps) ->
                      ans = new this()
                      props = objProps || {}
                      _id = this.__meta__.__repr__.insert(props)
                      ans.__props__[pn] = pv for pn, pv of objProps
                      return ans

                    all: (opts) ->
                      return this.find({}, opts)

                    find: (selector, opts) ->
                      if this.__meta__?
                        mList = this.__meta__.__repr__.find(selector, opts).fetch();
                        return convertMeteorArray(this, mList);
                      else
                        return []

                    findOne: (selector, opts) ->
                      if this.__meta__?
                        ans = this.__meta__.__repr__.findOne(selector, opts)
                        return convertMeteorObj(this, ans);
                      else
                        return undefined
                }
                
                
  Machine:    class Machine extends Record
  Event:      class Event extends Sig

  RecordMeta: class RecordMeta
                constructor: (fn, parentFn) ->
                  @__repr__        = null
                  @klass         = new Sunny.Types.Klass(fn.name, false, fn, null)
                  @name          = fn.name
                  @relative_name = fn.name
                  @sigCls        = fn
                  @parentSig     = parentFn
                  @subsigs       = []
                  @fields        = []

                hasOwnField: (fieldName) -> findFieldByName(this.fields, fieldName)
                hasField:    (fieldName) -> findFieldByName(this.allFields(), fieldName)
                field:       (fieldName) -> this.hasField(fieldName)
                allFields:   () -> if this.parentSig
                                     inherited = this.parentSig.__meta__.allFields()
                                     return inherited.concat(this.fields)
                                   else
                                     return this.fields
  EventMeta:  class EventMeta

  SunnyArrayExt: class SunnyArrayExt
                   push: (e) ->
                     this.super.push(e)
                     fld = this.__sunny__.field
                     obj = this.__sunny__.owner
                     mod = {}
                     val = e
                     val = e.id() unless fld.type.isPrimitive() 
                     mod[fld.name] = val
                     obj.meta().__repr__.update(
                       { _id: obj.id() },
                       { $push: mod }
                     )
                     return this

Sunny.simportAll(this, Sunny.Model)

Record.__meta__  = new RecordMeta(Record)
Machine.__meta__ = new RecordMeta(Machine, Record)
 
Sunny.meta =
  records: {}
  machines: {}
  events: {}

Sunny.Dsl = do -> 

  createKls = (kls, parent) ->
    console.log "creating '#{kls.name}' #{parent.name}"
    parentSig = kls.__super__?.constructor || parent
    unless kls.__super__?
      oldProt = kls.prototype
      `__extends(kls, parent)` #TODO: not complete (the constructor needs to be updated)
      kls.prototype[pn] = p for pn, p of oldProt

    # create meta
    meta = new RecordMeta(kls, parentSig)
    meta.__repr__ = new Meteor.Collection("__#{kls.name}")

    kls.__meta__ = meta

    # update parent's subsigs
    ps = parentSig
    while ps
      ps.__meta__.subsigs.push(kls)
      ps = ps.__meta__.parentSig

    # add fields
    for pn, p of kls.prototype
      if pn == "constructor" # skip the constructor function
      else
        type = Sunny.Types.asType(p)
        if type and not parentSig.__meta__.hasField(pn)
          meta.fields.push name: pn, type: type

    # add static methods
    s = kls
    while s
      for pn, pv of s.prototype.__static__
        pv = pv.bind(kls) if typeof(pv) == "function"
        kls[pn] = pv
      s = s.__meta__.parentSig

    for fld in meta.allFields()
      gfun = "function _f(o)    { return this.readField('#{fld.name}', o); };     _f; "
      sfun = "function _f(v, o) { return this.writeField('#{fld.name}', v, o); }; _f;"
      Object.defineProperty(kls.prototype, fld.name, {
        enumerable: false
        get: eval(gfun)
        set: eval(sfun)
      })

    return kls

  __exports__: ["record", "machine", "set"]

  record:  (x) -> x = createKls(x, Sunny.Model.Record); Sunny.meta.records[x.name] = x
  machine: (x) -> x = createKls(x, Sunny.Model.Machine); Sunny.meta.machines[x.name] = x

  set: (t) -> ans = Sunny.Types.asType(t); ans.mult = "set"; ans