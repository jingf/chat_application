Sunny = {};

Red = (function() {
  // ============================================================
  // private stuff
  // ============================================================
  var me = {
    assert : function(cond, msg) {
      if (!cond) {
        throw message || "Assertion failed";
      }
    },

    construct : function(name) {
      eval('var ' + name + ' = function (){};');
      return eval('new ' + name + ';');
    },

    defineRecordNonEnumProps : function(record) {
      var func = function() {return record.__type__; };
      Object.defineProperty(record, "name", {value: func});
      Object.defineProperty(record, "type", {value: func});
    },

    defineEventNonEnumProps : function(event) {
    },

    check_defined : function(x, msg) {
      if (x === undefined) throw Error(msg);
    },

    toSunnyObj : function(fld, val) {
      if (fld.primitive) {
        return val;
      } else {
        return me.toSunnyObj2(fld.type, val);
      }
    },

    toSunnyObj2 : function(sunnyCls, val) {
      var meteorObj = sunnyCls.meta.__repr__.findOne(val);
      return Utils.m2s(sunnyCls, meteorObj);
    },

    toSunnyList : function(obj, fld, val) {
      var ans = [];
      ans["__sunny__"] = {
        owner: obj,
        field: fld
      };
      for (var i = 0; i < val.length; i++) {
        ans.push(me.toSunnyObj(fld, val[i]));
      }

      // redefine push
      var arrPush = ans.push;
      ans.push = function(elem) {
        arrPush.call(this, elem);
        var sunnyObj = this.__sunny__.owner;
        var sunnyFld = this.__sunny__.field;
        var mod = {};
        mod[sunnyFld.name] = sunnyFld.primitive ? elem : elem.id;
        sunnyObj.meta().__repr__.update(
          {   _id: sunnyObj.id },
          { $push: mod }
        );
      };

      //TODO: what else to redefine??

      return ans;
    },

    toSunnyList2 : function(sunnyCls, val) {
      var ans = [];
      for (var i = 0; i < val.length; i++) {
        ans.push(me.toSunnyObj2(sunnyCls, val[i]));
      }
      return ans;
    },

    wrap : function(obj, fld, val) {
      if (fld.scalar) {
        return val;
      } else {
        if (val === undefined || val === null) {
          val = [];
          obj.writeField(fld.name, val);
        }
        return me.toSunnyList(obj, fld, val);
      }
    }
  };

  // ============================================================
  //   Some meta stuff about the underlying Red model
  // ============================================================

  var RedMeta = function() {
    this.records = {};
    this.events = {};
  };
  RedMeta.prototype = {
    search: function(hash, name) {
      var ans = hash[name];
      if (ans) return ans;
      for (var p in hash) {
        if (new RegExp("::" + name + "$").test(p))
          return hash[p];
      }
      return null;
    },

    record : function(name) { return this.search(this.records, name); },
    event  : function(name) { return this.search(this.events, name); },

    create      : function(constr, args) { return new constr(args); },
    createRecord: function(name, id)     { return this.create(this.record(name), id); },
    createEvent : function(name, params) { return this.create(this.event(name), params); }
  };

  // ============================================================
  //   Constructor functions
  // ============================================================

  var Constr = {
    extendProto : function(superFunc) {
      var constr = function() {};
      constr.prototype = superFunc.prototype;
      return new constr();
    },

    extendSig : function(name, superConstr, paramsStr, superArgsStr, body) {
      var funcStr = "f=function " + name + "(" + paramsStr + "){\n";

      var cstr = "{writable: true, value: arguments.callee}";
      funcStr +=
         "  if (this.redConstructor === undefined) {\n" +
         "    Object.defineProperty(this, 'redConstructor', " + cstr + ");\n" +
         "    Object.defineProperty(this, 'constructor', " + cstr + ");\n";
      if (superConstr) {
        var sup = "{writable: true, value: superConstr}";
        funcStr +=
         "    Object.defineProperty(this, 'superConstructor', " + sup + ");\n";
      }
      funcStr +=
         "  }\n";
      if (superConstr)
        funcStr += "  superConstr.call(this, " + superArgsStr + ");\n";
      if (body)
        funcStr += body + "\n";
      funcStr += "}";
      var c = eval(funcStr);
      if (superConstr)
        c.prototype = Constr.extendProto(superConstr);
      return c;
    },

    record : function(name, superRecordConstr) {
      if (superRecordConstr === undefined) superRecordConstr = Red.Model.Record;
      var c;
      if (superRecordConstr === null) {
        var body =
            "  Object.defineProperty(this, 'props', {enumerable: true, value: {}});\n" +
            "  this['id'] = id; \n" +
            "  if (objProps !== undefined) \n" +
            "    for (var p in objProps) this.props[p] = objProps[p]; ";
        c = Constr.extendSig(name, null, "id, objProps", null, body);
      } else {
        c = Constr.extendSig(name, superRecordConstr, "id, objProps", "id, objProps");
      }
      Object.defineProperty(c, "isRecordConstr", { value: true });
      Object.defineProperty(c, "all", {
        value: function(opts) {
          if (this.meta !== undefined) {
            var mList = this.meta.__repr__.find({}, opts).fetch();
            return me.toSunnyList2(this, mList);
          } else {
            return [];
          }
        }
      });
      Object.defineProperty(c, "find", {
        value: function(selector, opts) {
          if (this.meta !== undefined) {
            var mList = this.meta.__repr__.find(selector, opts).fetch();
            return me.toSunnyList2(this, mList);
          } else {
            return [];
          }
        }
      });
      Object.defineProperty(c, "create", {
        value: function(objProps) {
          var props = objProps || {};
          id = this.meta.__repr__.insert(props);
          var ans = new this(id, props);
          return ans;
        }
      });
      Object.defineProperty(c, "findOne", {
        value: function(a1,a2,a3,a4,a5,a6,a7,a8,a9) {
          var ret = this.meta.__repr__.findOne(a1,a2,a3,a4,a5,a6,a7,a8,a9);
          return Utils.m2s(this, ret);
        }
      });
      // for (var m in {find:'', findOne:''}) {
      //   var f = function(a1,a2,a3,a4,a5,a6,a7,a8,a9){
      //     return this.meta.__repr__[m](a1,a2,a3,a4,a5,a6,a7,a8,a9);
      //   };
      //   Object.defineProperty(c, m, { value: f });
      // }
      return c;
    },

    event : function(name, superEventConstr) {
      if (superEventConstr === undefined) superEventConstr = Red.Model.Event;
      var c;
      if (superEventConstr === null) {
        var body = "this.params=params || {}; this.canceled=false;";
        c = Constr.extendSig(name, null, "params", null, body);
      } else {
        c = Constr.extendSig(name, superEventConstr, "params", "params");
      }
      c.isEventConstr = true;
      Object.defineProperty(c, "trigger", {
        value: function(params) { new this(params).trigger(); }
      });
      return c;
    }
  };

  // ============================================================
  //   Serialization
  // ============================================================

  var Serializer = {
    serializeObject : function(obj) {
      var ans = {};
      for (var p in obj) { ans[p] = Serializer.serialize(obj[p]); }
      return ans;
    },

    serializeArray : function(arr) {
      var ans = [];
      for (var i in arr) { ans.push(Serializer.serialize(arr[i])); }
      return ans;
    },

    serialize : function(obj) {
      var ans;
      if (obj instanceof Array) {
        ans = Serializer.serializeArray(obj);
      } else if (obj instanceof Red.Model.Record) {
        ans = Serializer.serializeObject(obj);
        ans["is_record"] = true;
        ans["__type__"] = obj.meta().name;
      } else if (obj instanceof Object) {
        ans = Serializer.serializeObject(obj);
      } else {
        ans = obj;
      }
      return ans;
    },

    param : function(obj) {
      return jQuery.param(Serializer.serialize(obj));
    }
  };

  // ============================================================
  //   Various utility functions
  // ============================================================

  var Rendering = {
    renderTemplate : function(template, context) {
      var ans = template;
      for (var key in context) {
        ans = ans.replace(new RegExp("\\$\\{" + key + "\\}", 'g'), context[key]);
      }
      return ans;
    }
  };

  // ============================================================
  //   Various utility functions
  // ============================================================

  var Utils = {
    m2s : function (sunnyCls, meteorObj) {
      return new sunnyCls(meteorObj._id, meteorObj);
    },

    defaultTo : function(val, defaultVal) {
      if (typeof(val) === "undefined") {
        return defaultVal;
      } else {
        return val;
      }
    },

    truncate : function(str, len, opts) {
      str = jQuery.trim(str);
      if (str.length > len)
        return str.substring(0, len-3) + "...";
      else
        return str;
    },

    trunc : function(str, len, opts) { return Utils.truncate(str, len, opts); },

    toggleShow : function($elem, opts) {
      if ($elem.attr('disabled')) return false;
      $elem.attr('disabled', 'disabled');
      opts = Red.Utils.defaultTo(opts, {});
      var $target = opts.target || $(Utils.readData($elem, 'toggle-show'));
      var effect = opts.effect || Utils.readData($elem, 'effect') || "blind";
      var animOpts = opts.animOptions ||
            Utils.readData($elem, 'anim-opts') ||
            {direction: "up"};
       var dur = opts.duration || Utils.readData($elem, 'duration') || 500;

       var cb = function() { $elem.removeAttr('disabled'); };

       var showing = $target.is(":visible");
       if (showing) {
         $target.hide(effect, animOpts, dur, cb);
       } else {
         $target.show(effect, animOpts, dur, cb);
       }
       return false;
     },

     /* ----------------------------------------------------------------
      *
      * Reads the attribute value from a jQuery element, with some
      * additional processing.
      *
      *   - returns `undefined' if f no attribute with `paramName' is
      *     defined in `elem'.
      *
      *   - when the attribute value matches /^\$\{.*\}$/, evaluates
      *     the string inside ${}.  If the result is a jQuery array,
      *     it turns it into a regular Javascript array (by calling
      *     `jQuery.makeArray' on it.
      *
      * @param elem [jQuery]       - a jQuery element
      * @param paramName [string]  - name of the attribute to be read from `elem'
      *
      * @return undefined || string || anything (result of `eval')
      *
      * ---------------------------------------------------------------- */
     readParamValue : function(elem, paramName) {
       var $elem = $(elem);
       var paramValue = $elem.attr(paramName);

       if (paramValue === undefined) return undefined;

       // eval if matches /^\$\{.*\}$/
       var len = paramValue.length;
       if (paramValue.substring(0, 2) === "${" &&
         paramValue.substring(len-1, len) === "}") {
         paramValue = eval(paramValue.substring(2, len-1));
         if (paramValue instanceof jQuery) {
           paramValue = jQuery.makeArray(paramValue);
         }
       }
       return paramValue;
     },

     readParamForField : function(elem, paramName, fldMeta) {
       var ans = Utils.readParamValue(elem, paramName);
       if (ans !== undefined) {
         if (fldMeta.parent.isRecordConstr) {
           var id = Number(ans);
           if (isFinite(id)) ans = new fldMeta.parent(id);
         }
       }
       return ans;
     },

     readData : function(elem, name) {
       return Utils.readParamValue(elem, "data-" + name);
     },

    /* ----------------------------------------------------------------
     *
     * Goes through all undefined parameters (`undefParams') and asks
     * the user to provide values for them.  Once all values have been
     * provided, it calles the continuation function `triggerFunc'.
     *
     * Rules for asking the user to provide missing parameter values:
     *
     *   - if the parameter is of a primitive type, it simply prompts
     *     for a string value
     *
     *   - if the parameter is a file, it dynamically creates a form
     *     with a file input, and an iframe in order to achieve
     *     ajax-like file upload.
     *
     *   - if the parameter is of a record type, it shows a browse
     *     widget where the user can select an object.
     *
     * @param $elem       : jQuery    - a jQuery element
     * @param ev          : Red.Event - a Red event
     * @param undefParams : array     - list of parameters to prompt the
     *                                  user
     * @param triggerFunc : function  - continuation to run after all
     *                                  parameter values have been collected
     *
     * @return undefined
     *
     * ---------------------------------------------------------------- */
    askParams : function($elem, ev, undefParams, triggerFunc) {
      if (undefParams.length === 0) {
        $elem.removeData('file-form');
        triggerFunc();
        return;
      }
      var elemId = $elem.attr("id");
      var param = undefParams.shift();
      if (param.isFile()) {
        var uploadDiv = null;
        var iframe = null;
        var fileForm = $elem.data('file-form');
        if (typeof(fileForm) === "undefined") {
          uploadDiv = $('<div><form></form><iframe></iframe></div>');
          fileForm = $(uploadDiv.children()[0]);
          iframe = $(uploadDiv.children()[1]);

          uploadDiv.hide();

          var csrf = $('<input type="hidden" name="authenticity_token"></input>');
          csrf.val($('meta[name="csrf-token"]').attr("content"));
          fileForm.append(csrf);

          iframe.attr('id', elemId + "_upload_target");
          iframe.attr('name', iframe.attr('id'));
          iframe.attr('src', '#');
          iframe.attr('style', 'width:0;height:0;border:0px solid #fff;');

          fileForm.attr('method', 'post');
          fileForm.attr('enctype', 'multipart/form-data');
          fileForm.attr('target', iframe.attr('id'));

          ev.viaForm = fileForm;

          $elem.data('file-form', fileForm);
          $elem.after(uploadDiv);
        } else {
          uploadDiv = fileForm.parent();
          iframe = fileForm.next();
        }

        var fileInput = $('<input type="file"></input>');
        fileInput.attr('name', param.name);
        fileForm.append(fileInput);
        fileInput.bind("change", function(){
          ev.params[param.name] = $(this).val();
          Utils.askParams($elem, ev, undefParams, triggerFunc);
        });
        fileInput.trigger("click");
      } else if (param.isPrimitive()) {
        var ans = window.prompt("Enter value for '" + param.name + "'", "");
        if (ans !== null) {
          ev.params[param.name] = ans;
          Utils.askParams($elem, ev, undefParams, triggerFunc);
        } else {
          ev.cancel();
        }
      } else if (param.isRecord()) {
        alert("Missing Record parameters (" + param.name + ") not implemented");
      } else {
        console.debug("Unsupported parameter kind:");
        console.debug(param);
        throw new Error("unsupported parameter kind");
      }
    },

    /* ----------------------------------------------------------------
     *
     * Creates event declaratively specified through element's data
     * attributes:
     *
     *  - event name is read from either 'data-trigger-event' or
     *    'data-event-name' attribute
     *
     *  - event parameters are read from
     *      - 'data-param-*' attributes and
     *      - 'data-params-form' form input elements (if specified)
     *
     * @param $elem : jQuery    - a jQuery element
     *
     * ---------------------------------------------------------------- */
    declCreateEvent : function($elem) {
      var eventName = $elem.attr("data-trigger-event") ||
                      $elem.attr("data-event-name");
      //var ev = eval('new ' + eventName + '({})');
      var ev = Red.Meta.createEvent(eventName, {});
      var undefParams = [];

      var formId = $elem.attr("data-params-form");
      var formParams = {};
      if (formId !== undefined) {
        var form = $('#' + formId);
        form.serializeArray().map(function(e){
          formParams[e.name] = e.value;
        });
      }

      for (var paramIdx in ev.meta().params()) {
        var param = ev.meta().params()[paramIdx];
        var paramName = param.name;
        var paramValue = Utils.readParamValue($elem, "data-param-" + paramName) ||
                         formParams[paramName];
        if (paramValue === undefined) {
          undefParams.push(param);
        }
        ev.params[paramName] = paramValue;
      }
      return { event: ev, undefParams: undefParams };
    },

    /* ----------------------------------------------------------------
     *
     * Creates event declaratively specified through element's data
     * attributes (via the Utils.declCreateEvent func), and then
     *
     *  - prompts for missing parameters
     *
     *  - fires the event asynchronously (via jQuery.post)
     *
     *  - triggers either ${eventName}Done or ${eventName}Failed
     *    handler (if bound) after the event has been executed
     *
     * @param $elem : jQuery    - a jQuery element
     *
     * @return undefined
     *
     * ---------------------------------------------------------------- */
    declTriggerEvent : function($elem) {
      if ($elem.attr("disabled") === "disabled")
        return;

      var ans = Utils.declCreateEvent($elem);
      var ev = ans.event;
      var undefParams = ans.undefParams;
      var eventName = ev.meta().shortName();

      Utils.askParams($elem, ev, undefParams, function() {
        $elem.trigger(eventName + "Triggered", [ev]);
        if (!ev.canceled) {
          ev.fire(
          ).done(function(response) {
            $elem.trigger(eventName + "Done", [response]);
          }).fail(function(response) {
            $elem.trigger(eventName + "Failed", [response]);
          });
        }
      });
    }
  };

  var RedModel = function RedModel() {

    ///////////////////////////////////////////////////////
    this.RecordMeta = function RecordMeta(props) {
      jQuery.extend(this, props);
      var fullname = props["name"];
      var constr = props["sigCls"];
      if (constr.isRecordConstr) {
        Red.Meta.records[fullname] = constr;
      } else if (constr.isEventConstr) {
        Red.Meta.events[fullname] = constr;
      }
    };
    this.RecordMeta.prototype = {
      superRecord: function() { return this.parentSig; },
      subRecords: function() { return this.subsigs; },
      field: function(name) {
        for (var i = 0; i < this.fields.length; i++) {
          if (this.fields[i].name == name)
            return this.fields[i];
        }
        if (this.superRecord()) return this.superRecord().meta.field(name);
        return undefined;
      }
    };

    ///////////////////////////////////////////////////////
    this.EventMeta = Constr.extendSig("EventMeta", this.RecordMeta, "props", "props");
    this.EventMeta.prototype = {
      superEvent: function() { return this.parentSig; },
      subEvents: function() { return this.subsigs; },
      shortName: function() { return this.relative_name; },

      params: function() {
        var ans = [];
        if (this.superEvent() && this.superEvent().meta) {
          ans = [].concat(this.superEvent().meta.params());
        }
        var toFld = this.to();
        var fromFld = this.from();
        for (var fldIdx in this.fields) {
          var fld = this.fields[fldIdx];
          if (fld !== toFld && fld !== fromFld)
            ans.push(fld);
        }
        return ans;
      }
    };

    ///////////////////////////////////////////////////////
    this.Field = function Field(props) { jQuery.extend(this, props); };
    this.Field.prototype = {
      isRecord : function() {
        var t = this.type;
        return typeof(t) === "function" && t.isRecordConstr;
      },
      isFile : function() {
        return this.isRecord() && this.type.meta.name === "RedLib::Util::FileRecord";
      },
      isPrimitive : function() {
        return !this.isRecord(); //TODO: fix
      }
    };


    ///////////////////////////////////////////////////////
    this.Record = Constr.record("Record", null);
    jQuery.extend(this.Record.prototype, {
      is_record : true,
      readField : function(fldName, opts) {
        // return this.props[fldName];
        var fld = this.meta().field(fldName);
        var ans = this.meta().__repr__.findOne(this.id)[fldName];
        return me.wrap(this, fld, ans);
      },
      writeField: function(fldName, fldValue, opts) {
        this.props[fldName] = fldValue;
        mod = {};
        mod[fldName] = fldValue;
        this.meta().__repr__.update(
          { _id:  this.id },
          { $set: mod }
        );
      }
    });
    Object.defineProperty(this.Record.prototype, "meta", {
      value: function() { return this.constructor.meta; }
      // get: function() { return this.constructor.meta; }
    });

    ///////////////////////////////////////////////////////
    this.Event = Constr.event("Event", null);
    jQuery.extend(this.Event.prototype, {
      is_event : true,

      readField : function(fldName) {
        return this.params[fldName];
      },

      writeField: function(fldName, fldValue) {
        this.params[fldName] = fldValue;
      },

      trigger: function() {
        if (this.meta().requires) {
          var err = this.meta().requires.apply(this);
          if (err) {
            alert(err);
            return false;
          }
        }
        return this.meta().ensures.apply(this);
      },

      meta : function() {
        return this.constructor.meta;
      }
    });
  };


  var Red = {

    Meta       : new RedMeta(),
    Model      : new RedModel(),

    Constr     : jQuery.extend({}, Constr),
    Utils      : jQuery.extend({}, Utils),
    Renderer   : jQuery.extend({}, Rendering),
    Serializer : jQuery.extend({}, Serializer),

    // ===============================================================
    //   handlers
    // ===============================================================

    logMessages : function(data) {
      console.debug("[RED] update received; type:" + data.type
                    + ", payload: " + JSON.stringify(data.payload));
    },

    updateReceived : function(data) {
      return Red.Autoview.updateReceived(data);
    },

    initApp: function() {
      // init Sunny obj
      for (var r in Red.Meta.records) {
        var rec = Red.Meta.records[r];
        Sunny[rec.name] = rec;
      }

      for (var e in Red.Meta.events) {
        var ev = Red.Meta.events[e];
        Sunny[ev.name] = ev;
      }

      // init field getters/setters
      for (var prop in Sunny) {
        var cls = Sunny[prop];
        if (cls.meta === undefined) continue;
        for (var fldIdx = 0; fldIdx < cls.meta.fields.length; fldIdx++) {
          var fld = cls.meta.fields[fldIdx];
          var fldName = fld.name;
          var gfun = 'function f(o)      { return this.readField("' + fldName + '", o);}; f';
          var sfun = 'function f(val, o) { this.writeField("' + fldName + '", val, o);};  f';
          Object.defineProperty(cls.prototype, fldName , {
            enumerable: true,
            get: eval(gfun),
            set: eval(sfun)
          });
          Object.defineProperty(cls.prototype, "get_" + fldName , {
            enumerable: true,
            value: eval(gfun)
          });
          Object.defineProperty(cls.prototype, "set_" + fldName , {
            enumerable: true,
            value: eval(sfun)
          });
        }
      }
    }
  };

  return Red;
})();

