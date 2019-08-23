$(document).ready(function(){
    $.ajax({
        url: "/api/allmakes",
        type: 'get',
        dataType: 'json',
        success:function(response){
            console.log("I have run")
            console.log(response)
  
            var len = response.length;
  
            $("#dropdown1").empty();
                
            $("#dropdown1").append('<option value="" disabled  selected>Choose your option</option>');
            for( var i = 0; i<len; i++){
                var id = response[i]['id'];
                var name = response[i]['name'];
                
                $("#dropdown1").append("<option value='"+id+"'>"+name+"</option>");
  
            }
            $('#dropdown1').formSelect();
        }
    });
    $("#dropdown1").change(function(){
      var makeid = $(this).val();
      $.ajax({
          url: "/api/model/make/" + makeid,
          type: 'get',
          dataType: 'json',
          success:function(response){
    
              var len = response.length;
    
              $("#dropdown2").empty();
                  
              $("#dropdown2").append('<option value="" disabled  selected>Choose your option</option>');
              for( var i = 0; i<len; i++){
                  var id = response[i]['id'];
                  var name = response[i]['name'];
                  
                  $("#dropdown2").append("<option value='"+id+"'>"+name+"</option>");
    
              }
              $('#dropdown2').formSelect();
          }
      });
  
    });
  
  });
