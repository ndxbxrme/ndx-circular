((global, factory) ->
  if typeof exports is 'object' and typeof module isnt 'undefined'
    module.exports = factory()
  else if typeof define is 'function' and define.amd
    define(factory)
  else
    global.ndxCircular = factory()
) @, ->
  flatten = (obj) ->
    id = 0
    visited = []
    prepare = (obj) ->
      type = Object.prototype.toString.call obj
      if type is '[object Object]'
        if not obj.dc_id
          obj.dc_id = 'v' + ++id
          visited.push obj
          for key of obj
            prepare obj[key]
      else if type is '[object Array]'
        for f of obj
          prepare obj[f]
      true
    collapse = (obj) ->
      type = Object.prototype.toString.call obj
      if type is '[object Object]'
        for key of obj
          if (vObj = visited.indexOf(obj[key])) isnt -1
            obj[key] =
              vId: visited[vObj].dc_id
          else
            collapse obj[key]
      else if type is '[object Array]'
        for key of obj
          if (vObj = visited.indexOf(obj[key])) isnt -1
            obj[key] =
              vId: visited[vObj].dc_id
          else
            collapse obj[key]
      true
    prepare obj
    for v in visited
      collapse v
    output = {}
    for v in visited
      output[v.dc_id] = v
      delete v.dc_id
    output
  inflate = (flattened) ->
    visited = []
    doInflate = (obj) ->
      type = Object.prototype.toString.call obj
      if type is '[object Object]'
        if visited.indexOf(obj) is -1
          visited.push obj
          for key of obj
            if obj[key] and obj[key].vId
              obj[key] = flattened[obj[key].vId]
            doInflate obj[key]
      else if type is '[object Array]'
        for key of obj
          if obj[key] and obj[key].vId
            obj[key] = flattened[obj[key].vId]
          doInflate obj[key]
      true
    doInflate flattened.v1
    flattened.v1
  flatten: flatten
  inflate: inflate
