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

  class Record extends Klass
  class Machine extends Record
  class Event extends Klass

  class Type
    constructor: (@mult, @klasses) ->

  __exports : ["Int", "Bool", "Text"]

  Klass     : Klass
  Record    : Record
  Machine   : Machine
  Event     : Event
  Type      : Type
  Int       : new Klass "Int", true
  Bool      : new Klass "Bool", true
  Text      : new Klass "Text", true

# -----------------------------------------------

Sunny.meta =
  records: {}
  machines: {}
  events: {}

Sunny.Dsl = do ->

  createKls = (kls, parent) ->
    console.log "creating '#{kls.name}' #{parent.name}"
    unless kls.__super__?
      `__extends(kls, parent)`

    # for propName, prop of meta.prototype
    #   console.log "#{propName} --- #{prop}"
    return kls

  __exports: ["record", "machine", "set"]

  record:  (x) -> x = createKls(x, Sunny.Types.Record); Sunny.meta.records[x.name] = x
  machine: (x) -> x = createKls(x, Sunny.Types.Machine); Sunny.meta.machines[x.name] = x

  set: (t) -> new Sunny.Types.Type("set", t)