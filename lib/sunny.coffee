# global Sunny var
`
Sunny = {};
simport = function(sunny_pkg) {
  Sunny.import(this, sunny_pkg);
}
`

Sunny.import = (context, sunny_pkg) -> 
  for name in sunny_pkg.__exports
    context[name] = sunny_pkg[name]

Sunny.records = {}
Sunny.machines = {}
Sunny.events = {}

Sunny.Dsl =
  __exports: ["record", "machine", "set"]

  record: (x) -> console.log("record " + x.name); Sunny.records[x.name] = x
  machine: (x) -> console.log("machine " + x.name); Sunny.machines[x.name] = x


  set: (t) -> ["set", t]