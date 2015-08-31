/*
author:Prakash Chokalingam,
site:www.bit.ly/prakashchokalingam,
belongs:http://github.com/prakashchokalingam/tags-plugin;
*/


var tcount;
$.fn.tags=function(options)
{
	tcount=window.localStorage.getItem('tcount');
	if(tcount==null)
	{
		window.localStorage.setItem('tcount',1);
		tcount=1;
	}
	else
	{
		tcount=parseInt(window.localStorage.getItem('tcount'))+parseInt(1);
		window.localStorage.setItem('tcount',tcount);
	}

	// setting defaults
	if(!options.url)
		alert("Tag-Plugin Error : URL not found !");
	if(!options.method)
		options.method="get";
	if(!options.data)
		options.data="";
	if(!options.call)
		options.call="prefetch";
	if(!options.return_val)
		options.return_val="id";
	if(!options.image)
		options.image=false;
	if(!options.strict)
		options.strict=false;
	if(!options.repeat)
		options.repeat=false;
	if(!options.existing_val)
		options.existing_val="";

				// adding and styling of extra atrributes
				$(this).attr("type","hidden");
				$(this).attr('data-original',tcount);
				$(this).addClass('original');
				$(this).after('<div class="tag-holder'+tcount+' th"><input type="text"class="form-control duplicate_tag'+tcount+'" data-tcount="'+tcount+'"></div><div class="tag_result'+tcount+' tr"></div>');
				$(this).siblings(".tag-holder"+tcount).children('.duplicate_tag'+tcount).tag_operation(options,$(this));

			};
			$.fn.tag_operation=function(options,original)
			{
				duplicate=$('.duplicate_tag'+tcount);
				ctcount=tcount;
				if(options.existing_val)
				{
					if(options.existing_val.length!==0)
					{
						window.localStorage.setItem('tag_response'+tcount,JSON.stringify(options.existing_val));
						window.localStorage.setItem('tag_edata'+tcount,true);
						endfunction(duplicate,original);
						duplicate.parent().siblings().children("li").click();
						duplicate.val('');
						$(".list"+ctcount).parent().html("");
						window.localStorage.setItem('tag_edata'+tcount,false);
						window.localStorage.removeItem('tag_response'+tcount);

					}
				}
				else
				{
					window.localStorage.setItem('tag_edata'+tcount,false);
				}
				$(this).keyup(function(e){
					options.data.q=$(this).val();
					if(e.keyCode==188&options.strict==false)
						proceed="comma";
					else
						proceed="endfunction";
					ajax(options.url,options.method,options.data,options.call,$(this),original,options,proceed);
				});
				function ajax(url,method,data,call,duplicate,original,options,proceed)
				{
					if(call=="prefetch")
					{
						if(window.localStorage.getItem('tag_response'+tcount)==null)
						{
							$.ajax({
								url:url,
								method:method,
								data:data,
								success:function(value)
								{
									window.localStorage.setItem('tag_response'+tcount,JSON.stringify(value));
									if(proceed=="comma")
										comma(duplicate,original,options);
									else
										endfunction(duplicate,original);
								},
								error:function(value)
								{
									alert("Tags Plugin Error While Communicating : " +url);
								}

							});
						}
						else
						{
							if(proceed=="comma")
								comma(duplicate,original,options);
							else
								endfunction(duplicate,original);
						}
					}
					
					if(call=="remote")
					{

						$.ajax({
							url:url,
							method:method,
							data:data,
							success:function(value)
							{
								window.localStorage.setItem('tag_response'+tcount,JSON.stringify(value));
								if(proceed=="comma")
									comma(duplicate,original,options);
								else
									endfunction(duplicate,original);
							},
							error:function(value)
							{
								alert("Tags Plugin Error While Communicating : " +url);
							}

						});

					}
				}

				function endfunction(duplicate,original)
				{
					var popup="";
					var check_data=duplicate.val();
					var ctcount=duplicate.attr('data-tcount');
					var tag_response=JSON.parse(window.localStorage.getItem('tag_response'+ctcount));
					$.each(tag_response,function(fkey,fval){
						var $i=0;
						$.each(fval,function(skey,sval){
							if(fval['tag'].toLowerCase().indexOf(check_data.toLowerCase())>=0)
							{
								if(skey==options.return_val)
								{
									window.localStorage.setItem('tag_response_key'+tcount,sval);
								}

								if(options.image)
								{
									if(skey=="image")
										window.localStorage.setItem('tag_response_image'+tcount,sval);
								}

								if(skey=="tag")
								{
									if(options.image)
									{
										if(window.localStorage.getItem('tag_response_image'+tcount)!==null)
											popup=popup+'<li class="list'+ctcount+'" data-tag-value="'+window.localStorage.getItem("tag_response_key"+tcount)+'"><img src="'+window.localStorage.getItem("tag_response_image"+tcount+"")+'" class="img img-circle">'+sval+'</li>';

									}
									else
										popup=popup+'<li class="list'+ctcount+'" data-tag-value="'+window.localStorage.getItem("tag_response_key"+tcount)+'">'+sval+'</li>';

								}

							}
							else
							{

							}
							$i++;
						});
});
if(popup=="")
{
	if(options.nomatch)
		popup="<li>"+options.nomatch+"</li>";

	else
		popup="<li>No Match Found !</li>";
}

$(".tag_result"+ctcount).html(popup);
li_click(ctcount,original,duplicate,options);



}
function comma(duplicate,original,options)
{

	var t=duplicate.val();
	t=t.replace(',','');
	var popup="";
	var ctcount=duplicate.attr('data-tcount');
	popup=popup+'<li class="list'+ctcount+'" data-tag-value="'+t+'">'+t+'</li>';
	$(".tag_result"+ctcount).html(popup);
	li_click(ctcount,original,duplicate,options);
	$(".list"+ctcount).click();
	$(".tag_result"+ctcount).html("");

}
}
function li_click(ctcount,original,duplicate,options)
{
	$('body').on('click','.list'+ctcount,function(e){
		var temp=original.val().split(',');
		var flag=0;
		if(options.repeat==false)
		{
			for(var z=0;z<temp.length;z++)
			{
				if(temp[z]==$(this).attr('data-tag-value'))
				{
					flag=1;
				}
			}
		}
		
		if(flag==0)
		{
			duplicate.before('<span class="tagglets" data-original="'+ctcount+'">'+$(this).html()+'&nbsp; <span class="close" data-tag-value="'+$(this).attr('data-tag-value')+'">x</span></span>');
			if(original.val()=="")
			{
				original.val($(this).attr('data-tag-value'));
			}
			else
			{
				original.val(original.val()+","+$(this).attr('data-tag-value'));
			}
		}
		var edata=window.localStorage.getItem('tag_edata'+ctcount);

		if(edata=="false")
		{
			duplicate.val('');
			$(".tag_result"+ctcount).html("");

		}
		e.stopImmediatePropagation();

	});
	$('body').unbind('click','.list'+tcount);
}
$('body').on("click",".close",function(){
	var newval;
	var o=$(this).parent().attr('data-original');
	var original=$(".original[data-original="+o+"]")
	$(this).parent().remove();
	var x=original.val().split(',');
	for(z=0;z<x.length;z++)
	{
		if(x[z]==$(this).attr('data-tag-value'))
		{

		}
		else
		{
			if(z==0)
			{
				newval=x[z]
			}
			if(x[z]=="")
			{

			}
			else
			{
				newval=newval+","+x[z];
			}
		}
	}	
	original.val(newval);
});
$(window).unload(function(){
	for(var i=1;i<=tcount;i++)
	{
		window.localStorage.removeItem('tcount');
		window.localStorage.removeItem('tag_edata'+i);
		window.localStorage.removeItem('tag_response_image'+i);
		window.localStorage.removeItem('tag_response_key'+i);
	}
});


