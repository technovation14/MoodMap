function adjustHeight(el){
  el.style.height = (el.scrollHeight > el.clientHeight) ? (el.scrollHeight)+"px" : "60px";
}

var allowed=false;
function checkPermissions(){
  $.get("/allowed",function(res){
    console.log(res);
    allowed=JSON.parse(res.obj);
    if (allowed)
    $("#allowed").css("display","block");
  })
}


$('.noIndex:before').css('content','');

var currDate=moment().format("YYYY-MM-DD");
$("#createdDate").val(currDate);
$('#createdByName').val(JSON.parse(localStorage.getItem('user')).name);

function logout(){
  localStorage.removeItem('user');
  $.get('/logout',function(res){
    window.location="http://10.201.92.195:3003";
  });
}

var ideas=[];

function fetch(){
  var startDate=$("#startDate").val();
  //  var endDate=$("#endDate").val();
  var endDate =moment($("#endDate").val()).add(1, 'days').format("YYYY-MM-DD");
  //  $("#endDate").val();
  $.get('/ideas/range?startDate='+startDate+'&endDate='+endDate,function(res){
    console.log(res);
    ideas=res;
    $(".ideaRow").remove();
    var content;
    ideas.forEach(function(item){
      var flag=item.attachments?"show":"hide";
      var flag1=item.attachments?"hide":"show";
      content=`

      <tr  class="ideaRow">
      <td></td>
      <td class="noExl" style="border:0px solid black"><a href="/update?id=`+item._id+`" class="btn blue btn-floating" style="float:left"><i class="fa fa-edit"></i></a></td>
      <td class="noExl" style="border:0px solid black;display:none"><a href="/ideas/delete/`+item._id+`" class="btn red btn-floating " style="float:right"><i class="fa fa-close"></i></a></td>
      <td>`+item.theme+`</td>
      <td>`+item.domain+`</td>
      <td>`+item.businessBenefit+`</td>
      <td>`+item.useCase+`</td>
      <td>`+item.preCondition+`</td>
      <td>`+item.recommendedTools+`</td>
      <td>`+item.acceptanceCriteria+`</td>
      <td>`+item.ideaStatus+`</td>
      <td>`+moment(item.createdDate).format("MM-DD-YYYY")+`</td>
      <td>`+item.email+`</td>
      <td>`+item.createdByName+`</td>
      <td>`+item.commentLog+`</td>
      <td ><a title="View File" class="`+flag+`" target="_blank" href="http://10.201.92.195:4008/uploads/`+item.attachments+`"><i class="fa fa-2x fa-paperclip"></i></a><i title="Click to add file" onclick="setId('`+item._id+`')" class="fa fa-upload fa-2x `+flag1+`" data-target="#fileModal" data-toggle="modal"></i><i title="Click to change file" onclick="setId('`+item._id+`')" class="fa fa-refresh fa-2x `+flag+`" data-target="#fileModal" data-toggle="modal"></i> </td>

      `;
      // var content2="";
      // item.attachments.forEach(function(file){
      //   console.log(file);
      //   content2+=`<a title="View File" class="`+flag+`" target="_blank" href="http://10.201.92.195:4008/uploads/`+file+`"><i class="fa fa-2x fa-paperclip"></i></a>
      //
      //   `;
      // })
      // var content3=`<i title="Click to add file" onclick="setId('`+item._id+`')" class="fa fa-upload fa-2x" data-target="#fileModal" data-toggle="modal"></i>
      // </td>
      // </tr>`;
      $(".dataTable").append(content);
    })
  })
  // <a title="View File" class="`+flag+`" target="_blank" href="http://10.201.92.195:4008/uploads/`+item.attachments+`"><i class="fa fa-2x fa-paperclip"></i></a>
}


function fetchMyIdeas(){
  var startDate=$("#startDate").val();
  var endDate =moment($("#endDate").val()).add(1, 'days').format("YYYY-MM-DD");
  $.get('/ideas/email',function(res){
    console.log(res);
    ideas=res;
    $(".ideaRow").remove();
    var content;
    ideas.forEach(function(item){
      var flag=item.attachments?"show":"hide";
      var flag1=item.attachments?"hide":"show";
      content=`

      <tr  class="ideaRow">
      <td></td>
      <td class="noExl" style="border:0px solid black"><a href="/update?id=`+item._id+`" class="btn blue btn-floating" style="float:left"><i class="fa fa-edit"></i></a></td>
      <td class="noExl" style="border:0px solid black;display:none"><a href="/ideas/delete/`+item._id+`" class="btn red btn-floating " style="float:right"><i class="fa fa-close"></i></a></td>
      <td>`+item.theme+`</td>
      <td>`+item.domain+`</td>
      <td>`+item.businessBenefit+`</td>
      <td>`+item.useCase+`</td>
      <td>`+item.preCondition+`</td>
      <td>`+item.recommendedTools+`</td>
      <td>`+item.acceptanceCriteria+`</td>
      <td>`+item.ideaStatus+`</td>
      <td>`+moment(item.createdDate).format("MM-DD-YYYY")+`</td>
      <td>`+item.email+`</td>
      <td>`+item.createdByName+`</td>
      <td>`+item.commentLog+`</td>
      <td ><a title="View File" class="`+flag+`" target="_blank" href="http://10.201.92.195:4008/uploads/`+item.attachments+`"><i class="fa fa-2x fa-paperclip"></i></a><i title="Click to add file" onclick="setId('`+item._id+`')" class="fa fa-upload fa-2x `+flag1+`" data-target="#fileModal" data-toggle="modal"></i><i title="Click to change file" onclick="setId('`+item._id+`')" class="fa fa-refresh fa-2x `+flag+`" data-target="#fileModal" data-toggle="modal"></i> </td>

      `;
      $(".dataTable").append(content);
    })
  })
}

function search() {
  var results;
  var name=$("#key").val();
  name = name.toUpperCase();
  results = $.map(ideas, function(entry) {
    var match = (entry.createdByName.toUpperCase().indexOf(name) !== -1)||(entry.domain.toUpperCase().indexOf(name) !== -1)||(entry.useCase.toUpperCase().indexOf(name) !== -1)||(entry.theme.toUpperCase().indexOf(name) !== -1);
    return match ? entry : null;
  });

  $(".ideaRow").remove();
  results.forEach(function(item){
    var flag=item.attachments?"show":"hide";
    var flag1=item.attachments?"hide":"show";
    content=`
    <tr  class="ideaRow">
    <td></td>
    <td class="noExl" style="border:0px solid black"><a href="/update?id=`+item._id+`" class="btn blue btn-floating" style="float:left"><i class="fa fa-edit"></i></a></td>
    <td class="noExl" style="border:0px solid black;display:none"><a href="/ideas/delete/`+item._id+`" class="btn red btn-floating " style="float:right"><i class="fa fa-close"></i></a></td>
    <td>`+item.theme+`</td>
    <td>`+item.domain+`</td>
    <td>`+item.businessBenefit+`</td>
    <td>`+item.useCase+`</td>
    <td>`+item.preCondition+`</td>
    <td>`+item.recommendedTools+`</td>
    <td>`+item.acceptanceCriteria+`</td>
    <td>`+item.ideaStatus+`</td>
    <td>`+moment(item.createdDate).format("MM-DD-YYYY")+`</td>
    <td>`+item.createdByName+`</td>
    <td>`+item.commentLog+`</td>
    <td ><a title="View File" class="`+flag+`" target="_blank" href="http://10.201.92.195:4008/uploads/`+item.attachments+`"><i class="fa fa-2x fa-paperclip"></i></a><i title="Click to add file" onclick="setId('`+item._id+`')" class="fa fa-upload fa-2x `+flag1+`" data-target="#fileModal" data-toggle="modal"></i><i title="Click to change file" onclick="setId('`+item._id+`')" class="fa fa-refresh fa-2x `+flag+`" data-target="#fileModal" data-toggle="modal"></i> </td>
    </tr>
    `;
    $(".dataTable").append(content);
  })

}


function deleteIdea(id){
  console.log(id);
  $.get('/ideas/delete/'+id,function(res){
    console.log(res);
    alert('Deleted');
    window.location="http://10.201.92.195:4008/home";
  })

}

function exportToExcel(){
  console.log("called to export");
  var reportName="Ideas_Report_ "+moment().format('DD-MM-YYYY');
  $("#printToExcel").table2excel({
    exclude:'.noExl',
    filename: reportName //do not include extension
  });
}
