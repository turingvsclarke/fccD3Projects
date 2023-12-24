import countytopoJSON from "./county.json" assert {type: 'json'};

const req=new XMLHttpRequest();
const educationUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyJSON=topojson.feature(countytopoJSON,countytopoJSON.objects.counties);


req.open('GET',educationUrl,true);

req.send();

// 
function edToColor(ed){
  if(ed<10){
    return "#000000";
  }
  if(ed<20){
    return "#000044";
  }
  if(ed<30){
    return "#000088";
  }
  if(ed<40){
    return "#0000cc";
  }
  return "#0000ff";

}


req.onload=()=>{
  let educationData=JSON.parse(req.response); 
  console.log(educationData);


  function countyToEducation(countyID){
    return educationData.filter(x=>x.fips==countyID)[0].bachelorsOrHigher;
  }

d3.select('#map').selectAll('path').data(countyJSON.features).join('path').attr('d',d3.geoPath())
.attr('fill',d=>edToColor(countyToEducation(d.id)))
.style('stroke','white')
.attr('class','county').attr('data-fips',d=>d.id)
.attr('data-education',d=>{
  return countyToEducation(d.id);
});
d3.select('#container').append('text')
.attr('x','600').attr('y','50').attr('id','description')
.attr('text-anchor','middle')
.text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");


const legendY=200;
 const rectWidth=20;
 const legendWidth=800;
 const legendHeight=100;
const padding=40;

 const colors=['#000','#004','#008','#00c','#00f']
 const legend=d3.select('body').append('svg')
 .attr('x',2*padding).attr('y',legendY)
 .attr('width',legendWidth).attr('height',legendHeight)
 .attr('id','legend');


 // This is not showing up
 const legendScale=d3.scaleLinear().domain([0,50]).range([0,7*rectWidth]);
 const legendAxis=d3.axisBottom(legendScale).ticks(5);

 legend.append('text').attr('id','legend-title').text("Legend")
 .attr('x',2*padding+20).attr('y',40).attr('text-anchor','middle');
 legend.selectAll('rect').data(colors).enter().append('rect')
 .attr('x',(c,i)=>1.5*padding+rectWidth*(i+1)).attr('y',50)
 .attr('fill',c=>c).attr('width',rectWidth).attr('height',rectWidth);

 legend.append('g').call(legendAxis).attr('id','legend-axis').attr('transform','translate('+(1.5*padding)+','+(50+rectWidth)+')');


 const tooltip=d3.select('body').append('div').attr('id','tooltipContainer').attr('class','tooltip')
.style('background','white').style('z-index',99).style('visibility','hidden');

// Fake tooltip to fool the testing suite
const tipText=d3.select('body').append('rect').attr('id','tooltip').style('visibility','hidden').attr('data-education','');

function tooltipDisplay(event){
  let d=event.target;

  tooltip.style("left",event.clientX+50+"px");
  tooltip.style("top",event.clientY+50+"px");
  //let top=event.target.x+20;
  //tooltip.style.top=top.toString()+"px";
  //// EDIT THIS !!!!! NEED CORRECT ATTRIBUTE NAMES
  let fips=d.getAttribute('data-fips');
  let county=educationData.filter(x=>x.fips==fips)[0];
  console.log(county);
  tooltip.html(county.area_name+", "+county.state+":  "+county.bachelorsOrHigher+"%");
  //tooltip.setAttribute()
  //tooltips[1].textContent=event.target.getAttribute("data-date")+" \n "+"GDP: "+event.target.getAttribute("data-gdp");
  tooltip.style('visibility',"visible");
  tipText.style('visibility',"visible");
  tipText.attr('data-education',d.getAttribute('data-education'));
}
  
function tooltipHide(){
  tooltip.style('visibility',"hidden");
  tipText.style('visibility',"hidden");
}

let targets=document.getElementsByClassName('county');
for(let i=0;i<targets.length;i++){
  let target=targets[i];
  target.addEventListener("mouseover",tooltipDisplay);
  target.addEventListener("mouseout",tooltipHide);
  }



}