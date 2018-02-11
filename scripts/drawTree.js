/*
 * draws a collapsible tree from hierarchical JSON data
 */

function drawTree(treeData, domElement) {

    if(domElement == null) {
        var width = window.innerWidth,
            height = window.innerHeight;
        
        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
    }
    else {
        var width = domElement.getBoundingClientRect().width,
            height = domElement.getBoundingClientRect().height;
        var svg = d3.select(domElement);
        console.log(width, height);
    }
    
    var i = 0,
        duration = 750,
        root;
    
    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);
    
    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;
    
    // Collapse after the second level
    root.children.forEach(collapse);
    
    update(root);
    
    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }
    
    function update(source) {
    
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);
    
      // Compute the new tree layout.
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);
    
      // Normalize for fixed-depth.
      nodes.forEach(function(d){ d.y = d.depth * 180});
    
      // ****************** Nodes section ***************************
    
      // Update the nodes...
      var node = svg.selectAll('g.node')
          .data(nodes, function(d) {return d.id || (d.id = ++i); });
    
      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);
    
      // Add Circle for the nodes
      function getBB(selection) {
          selection.each(function(d){d.bbox = this.getBBox();})
      };
    
      // Add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("x", "0")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; }).call(getBB)
          .attr('pointer-events', 'none');
      nodeEnter.insert("rect","text")
          .attr("x", function(d){return -d.bbox.width/2})
          .attr("y", function(d){return -d.bbox.height/2})
          .attr("width", function(d){return d.bbox.width})
          .attr("height", function(d){return d.bbox.height})
          .style("fill", "white")
          .style('opacity', 0.8);
    
      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);
    
      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
         });
    
      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');
    
    
      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();
    
      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);
    
      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);
    
      // ****************** links section ***************************
    
      // Update the links...
      var link = svg.selectAll('path.link')
          .data(links, function(d) { return d.id; });
    
      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", "link")
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          });
    
      // UPDATE
      var linkUpdate = linkEnter.merge(link);
    
      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });
    
      // Remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();
    
      // Store the old positions for transition.
      nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
      });
    
      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
    
        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
    
        return path
      }
    
      // Toggle children on click.
      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        update(d);
      }
    }
}
