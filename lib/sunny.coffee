# global Sunny var
`
Sunny = {};
simport = function(sunny_pkg) {
  Sunny.simport(this, sunny_pkg);
}
`

Sunny.simport = (context, sunny_pkg) ->
  return unless sunny_pkg? and sunny_pkg.__exports?
  for name in sunny_pkg.__exports
    context[name] = sunny_pkg[name]

# -----------------------------------------------
# types
# -----------------------------------------------

Sunny.Types = do ->
  class Klass
    constructor: (@name, @primitive) ->

  class RecordKlass extends Klass
  class MachineKlass extends Klass
  class EventKlass extends Klass
        
  class Type
    constructor: (@mult, @klasses) ->

  __exports : ["Int", "Bool", "Text"]

  Klass     : Klass 
  Type      : Type
  Int       : new Klass "Int", true
  Bool      : new Klass "Bool", true
  Text      : new Klass "Text", true
  isKlass   : (fn) -> typeof(fn) == "function" and fn.__meta?


# -----------------------------------------------

Sunny.Model = do ->
  Record: class Record
  Machine: class Machine
  Event: class Event
 

Sunny.meta =
  records: {},
  machines: {},
  events: {}

Sunny.Dsl = do ->
 
  createKls = (kls, parent) ->
    console.log "creating '#{kls.name}' #{parent.name}"
    unless kls.__super__?
      console.log "extending #{kls}"
      oldProt = kls.prototype
      `__extends(kls, parent)`
      kls.prototype[pn] = p for pn, p of oldProt

    meta =
      __repr__: new Meteor.Collection("__#{kls.name}"),  #TODO remove '__'
      name: kls.name,
      relative_name: kls.name,
      sigCls: kls,
      parentSig: null,
      subsigs: [],
      fields: []
      
    for pn, p of kls.prototype
      if pn == "constructor"
      else if typeof p == "function" and not Sunny.Types.isKlass(p)
      else 
        meta.fields.push name: pn, type: p

    kls.meta = meta # TODO: remove
    kls.__meta = meta
    return kls

  __exports: ["record", "machine", "set"]

  record:  (x) -> x = createKls(x, Sunny.Model.Record); Sunny.meta.records[x.name] = x
  machine: (x) -> x = createKls(x, Sunny.Model.Machine); Sunny.meta.machines[x.name] = x

  set: (t) -> new Sunny.Types.Type("set", t)