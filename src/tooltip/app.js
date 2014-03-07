//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Creates correctly formatted tooltip for Apps
//-------------------------------------------------------------------
d3plus.tooltip.app = function(params) {

  var vars = params.vars,
      d = params.data,
      ex = params.ex,
      mouse = params.mouseevents ? params.mouseevents : false,
      arrow = "arrow" in params ? params.arrow : true,
      id = d3plus.variable.value(vars,d,vars.id.key),
      tooltip_id = params.id || vars.type.value

  if ((d3.event && d3.event.type == "click") && (vars.html.value || vars.tooltip.value.long) && !("fullscreen" in params)) {
    var fullscreen = true,
        arrow = false,
        mouse = true,
        length = "long",
        footer = vars.footer.value

    vars.covered = true
  }
  else {
    var fullscreen = false,
        align = params.anchor || vars.style.tooltip.anchor,
        length = params.length || "short",
        footer = vars.footer_text()
  }

  if (params.x) {
    var x = params.x
  }
  else if (d3plus.apps[vars.type.value].tooltip == "follow") {
    var x = d3.mouse(vars.parent.node())[0]
  }
  else {
    var x = d.d3plus.x+vars.margin.left
  }

  if (params.y) {
    var y = params.y
  }
  else if (d3plus.apps[vars.type.value].tooltip == "follow") {
    var y = d3.mouse(vars.parent.node())[1]
  }
  else {
    var y = d.d3plus.y+vars.margin.top
  }

  if (params.offset) {
    var offset = params.offset
  }
  else if (d3plus.apps[vars.type.value].tooltip == "follow") {
    var offset = 3
  }
  else {
    var offset = d.d3plus.r ? d.d3plus.r : d.d3plus.height/2
  }

  function make_tooltip(html) {

    if (d.d3plus.children) {
      if (!ex) ex = {}
      ex.items = d.d3plus.children.length
    }

    var active = vars.active.key ? d3plus.variable.value(vars,d,vars.active.key) : d.d3plus.active,
        temp = vars.temp.key ? d3plus.variable.value(vars,d,vars.temp.key) : d.d3plus.temp,
        total = vars.total.key ? d3plus.variable.value(vars,d,vars.total.key) : d.d3plus.total

    if (typeof active == "number" && active > 0 && total) {
      if (!ex) ex = {}
      var label = vars.active.key || "active"
      ex[label] = active+"/"+total+" ("+vars.format((active/total)*100,"share")+"%)"
    }

    if (typeof temp == "number" && temp > 0 && total) {
      if (!ex) ex = {}
      var label = vars.temp.key || "temp"
      ex[label] = temp+"/"+total+" ("+vars.format((temp/total)*100,"share")+"%)"
    }

    if (d.d3plus.share) {
      if (!ex) ex = {}
      ex.share = vars.format(d.d3plus.share*100,"share")+"%"
    }

    var depth = "depth" in params ? params.depth : vars.depth.value,
        title = d3plus.variable.value(vars,d,vars.text.key,vars.id.nesting[depth]),
        icon = d3plus.variable.value(vars,d,vars.icon.key,vars.id.nesting[depth]),
        tooltip_data = d3plus.tooltip.data(vars,d,length,ex,depth)

    if ((tooltip_data.length > 0 || footer) || !d.d3plus_label) {

      if (!title) {
        title = id
      }

      var depth = d.d3plus && "depth" in d.d3plus ? vars.id.nesting[d.d3plus.depth] : vars.id.key

      if (typeof vars.icon.style.value == "string") {
        var icon_style = vars.icon.style.value
      }
      else if (typeof vars.icon.style.value == "object" && vars.icon.style.value[depth]) {
        var icon_style = vars.icon.style.value[depth]
      }
      else {
        var icon_style = "default"
      }

      if (params.width) {
        var width = params.width
      }
      if (!fullscreen && tooltip_data.length == 0) {
        var width = "auto"
      }
      else {
        var width = vars.style.tooltip.width
      }

      d3plus.tooltip.create({
        "align": align,
        "arrow": arrow,
        "background": vars.style.tooltip.background,
        "curtain": vars.style.tooltip.curtain.color,
        "curtainopacity": vars.style.tooltip.curtain.opacity,
        "fontcolor": vars.style.tooltip.font.color,
        "fontfamily": vars.style.tooltip.font.family,
        "fontsize": vars.style.tooltip.font.size,
        "fontweight": vars.style.tooltip.font.weight,
        "data": tooltip_data,
        "color": d3plus.variable.color(vars,d),
        "footer": footer,
        "fullscreen": fullscreen,
        "html": html,
        "icon": icon,
        "id": tooltip_id,
        "max_width": vars.style.tooltip.width,
        "mouseevents": mouse,
        "offset": offset,
        "parent": vars.parent,
        "style": icon_style,
        "title": title,
        "width": width,
        "x": x,
        "y": y
      })

    }

  }

  if (fullscreen) {

    if (typeof vars.html.value == "string") {
      make_tooltip(vars.html.value)
    }
    else if (typeof vars.html.value == "function") {
      make_tooltip(vars.html.value(id))
    }
    else if (vars.html.value && typeof vars.html.value == "object" && vars.html.value.url) {
      d3.json(vars.html.value.url,function(data){
        var html = vars.html.value.callback ? vars.html.value.callback(data) : data
        make_tooltip(html)
      })
    }
    else {
      make_tooltip("")
    }

  }
  else {
    make_tooltip("")
  }

}
