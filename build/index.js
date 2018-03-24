(function() {
  (function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      return module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else {
      return global.ndxCircular = factory();
    }
  })(this, function() {
    var flatten, inflate;
    flatten = function(obj) {
      var collapse, i, id, j, len, len1, output, prepare, v, visited;
      id = 0;
      visited = [];
      prepare = function(obj) {
        var f, key, type;
        type = Object.prototype.toString.call(obj);
        if (type === '[object Object]') {
          if (!obj.dc_id) {
            obj.dc_id = 'v' + ++id;
            visited.push(obj);
            for (key in obj) {
              prepare(obj[key]);
            }
          }
        } else if (type === '[object Array]') {
          for (f in obj) {
            prepare(obj[f]);
          }
        }
        return true;
      };
      collapse = function(obj) {
        var key, type, vObj;
        type = Object.prototype.toString.call(obj);
        if (type === '[object Object]') {
          for (key in obj) {
            if ((vObj = visited.indexOf(obj[key])) !== -1) {
              obj[key] = {
                vId: visited[vObj].dc_id
              };
            } else {
              collapse(obj[key]);
            }
          }
        } else if (type === '[object Array]') {
          for (key in obj) {
            if ((vObj = visited.indexOf(obj[key])) !== -1) {
              obj[key] = {
                vId: visited[vObj].dc_id
              };
            } else {
              collapse(obj[key]);
            }
          }
        }
        return true;
      };
      prepare(obj);
      for (i = 0, len = visited.length; i < len; i++) {
        v = visited[i];
        collapse(v);
      }
      output = {};
      for (j = 0, len1 = visited.length; j < len1; j++) {
        v = visited[j];
        output[v.dc_id] = v;
        delete v.dc_id;
      }
      return output;
    };
    inflate = function(flattened) {
      var doInflate, visited;
      visited = [];
      doInflate = function(obj) {
        var key, type;
        type = Object.prototype.toString.call(obj);
        if (type === '[object Object]') {
          if (visited.indexOf(obj) === -1) {
            visited.push(obj);
            for (key in obj) {
              if (obj[key] && obj[key].vId) {
                obj[key] = flattened[obj[key].vId];
              }
              doInflate(obj[key]);
            }
          }
        } else if (type === '[object Array]') {
          for (key in obj) {
            if (obj[key] && obj[key].vId) {
              obj[key] = flattened[obj[key].vId];
            }
            doInflate(obj[key]);
          }
        }
        return true;
      };
      doInflate(flattened.v1);
      return flattened.v1;
    };
    return {
      flatten: flatten,
      inflate: inflate
    };
  });

}).call(this);

//# sourceMappingURL=index.js.map
