var admin = function(dom) {
	var lock = false;
	var article_id = null;
	var imgFile = null;
	var getCookie = function(name) {
	    var dc = document.cookie;
	    var prefix = name + "=";
	    var begin = dc.indexOf("; " + prefix);
	    if (begin == -1) {
	        begin = dc.indexOf(prefix);
	        if (begin != 0) return null;
	    }
	    else
	    {
	        begin += 2;
	        var end = document.cookie.indexOf(";", begin);
	        if (end == -1) {
	        end = dc.length;
	        }
	    }
	    return unescape(dc.substring(begin + prefix.length, end));
	}


	var adminMainMarkup = function()
	{
		var html = '<div class="navbar">'+
					'<ul id="mainAdminBar">'+
						'<li><button title="nuevo articulo" class="icon icon-align-left" id="newArticleBtn"></button></li>'+
						'<li><button title="nuevo producto" class="icon icon-pencil" id="newProductBtn"></button></li>'+
						'<li><button title="nuevo imagen slide" class="icon icon-picture" id="newSlideBtn"></button></li>'+
						'<li><button title="administracion de usuario" class="icon icon-user" id="userAdminBtn"></button></li>'+
					'<ul>'+
					'</div>';
		return html;
	}


	var adminMarkup = function()
	{
		var html =	'<button class="btn pull-left icon icon-cog adminBtn"></button>'+
					'<button class="btn pull-left removeBtn icon icon-remove-circle"></button>';

		return html;

	}

	//article
	var saveArticle = function(e)
	{
		e.preventDefault();	
		var $artModal = $("#modalArticle");
		
		var data = {
		 id : article_id,
		 url : $artModal.find("#urlArticle").val(),
		 image : imgFile,
		 title : tinyMCE.get('titleTextArticle').getContent(),
		 resume : tinyMCE.get('introTextArticle').getContent(),
		 text : tinyMCE.get('mainTextArticle').getContent()
		};

		$.ajax({
			url : ["//", window.location.host,"/articulo/editar"].join(""),
			type: "PUT",
			data : data,
			success: function(data) {
				window.location.reload();
			}
		});
	}

	//article
	var saveNewArticle = function(e)
	{
		e.preventDefault();	
		var $artModal = $("#modalArticle");

		var data = {
		 url : $artModal.find("#urlArticle").val(),
		 image : imgFile,
		 title : tinyMCE.get('titleTextArticle').getContent(),
		 resume : tinyMCE.get('introTextArticle').getContent(),
		 text : tinyMCE.get('mainTextArticle').getContent()
		};
		
		
		$.ajax({
			url : ["//", window.location.host,"/articulo/crear"].join(""),
			type: "POST",
			data : data,
			success: function(data) { 
				window.location.reload();
			}
		});
		
	}

	var renderArticleModal = function(art)
	{
		var $artModal = $("#modalArticle");
		$artModal.find("#titleTextArticle").val(art.title);
		$artModal.find("#introTextArticle").val(art.resume);
		$artModal.find("#typeArticle").val(art.type);
		$artModal.find("#mainTextArticle").val(art.text);
		$artModal.find("#urlArticle").val(art.url);
		renderImage(art.image);

		tinymce.init({
			selector:'.tinymce'
		});


		$artModal.modal({ show : true, backdrop: false});

		$artModal.find("#saveArticleBtn").unbind("click");
		$artModal.find("#saveArticleBtn").bind("click",saveArticle);
	}

	var articleModal = function(el)
	{
		article_id = el.attr('id');
		$.ajax({
			url : ["//", window.location.host,"/articulo/article.json?id=" + article_id].join(""),
			type: "GET",
			success: function(data) { 
				renderArticleModal(data);
			}
		});
	}


	// slides 
	var slidesModal = function(e)
	{

	}

	var productModal = function(e)
	{

	}


	var showAdminOpts = function(e)
	{	
		var parent = $(e.target).parent(".admin");
		var reparent = $(e.target).parent().parent(".admin");


		if (parent.hasClass('article') || reparent.hasClass('article'))
			articleModal(parent);

		if (parent.hasClass('slides')  || reparent.hasClass('slides'))
			slidesModal(parent);
		
		if (parent.hasClass('product') || reparent.hasClass('product'))
			productModal(parent);


	}

	// MODALS!
	var newAdminModal = function(ev)
	{
		ev.preventDefault();
		$admModal = $("#modalAdminUser");
		$.ajax({
			url : ["//",window.location.host,"/usuario/adminlist.json"].join(''),
			type: "GET",
			success : function(data)
			{

				if (data.length > 0)
				{
					$admList = $("#adminList");
					$admList.html("");
					$admList.append("<option value=''>Seleccione para editar un administrador</option>");
					for (var i = data.length - 1; i >= 0; i--) {
						$admList.append("<option value='"+ data[i].id +"''>"+ data[i].username + "</option>");
					};


					$admList.change(function() { 
						var id = $(this).children("option:selected").val();
						$("#idAdmin").val(id);
						$("#usernameAdmin").val($(this).children("option:selected").html());
					});
				}

				$admModal.modal({ show: true, backdrop: false});
				$("#saveAdminUserBtn").unbind("click");
				$("#saveAdminUserBtn").bind("click",createAdmin);
			}
		});
	}


	var createAdmin = function (ev)
	{
		ev.preventDefault();
		var id = $("#idAdmin").val();
		var username = $("#usernameAdmin").val();
		var password = $("#passwordAdmin").val();
		if (id == "") {
			$.ajax({
				url : "//" + window.location.host + "/usuario/register.json",
				data: { username : username, password: password},
				type: "POST",
				success: function(data)
				{
					alert("Administrador creado");
				}
			});	
		} else {
			$.ajax({
				url : "//" + window.location.host + "/usuario/update.json",
				data: { id: id, username : username, password: password},
				type: "PUT",
				success: function(data)
				{
					alert("Administrador actualizado");
				}
			});
		}
	}


	var newArticleModal = function(ev)
	{
		ev.preventDefault();
		
		$artModal = $("#modalArticle");
		$artModal.modal({ show : true, backdrop: false});
		
		tinymce.init({
			selector:'.tinymce'
		});

		$artModal.find("#urlArticle").val("");
		if (tinyMCE.get('titleTextArticle') !== undefined) {
			tinyMCE.get('titleTextArticle').setContent("");
			tinyMCE.get('introTextArticle').setContent("");
			tinyMCE.get('mainTextArticle').setContent("");
		}

		$artModal.find("#saveArticleBtn").unbind("click");
		$artModal.find("#saveArticleBtn").bind("click",saveNewArticle);
	}


	var removeElement = function(e)
	{
		var id = $(e.target).parent().attr('id');


		if (id != undefined)
		{
			var reply = confirm("Vas a eliminar una publicacion, ¿ estas seguro(a) ?");
			if (reply)
			{
				$.ajax({
					url : ["//",window.location.host,"/articulo/eliminar"].join(''),
					data : { id : id},
					type: "DELETE",
					success: function() {
						//window.location.reload();
					}

				});
			}
		}

	}


	var setAdminMode = function()
	{
		$(".article").addClass('admin');
		$(".slides").addClass('admin');
		$(".product").addClass('admin');

		// add admin markup to body and classes

		$(document.body).append(adminMainMarkup());
		$(".admin").prepend(adminMarkup());

		// set Listeners


		$(".adminBtn").each(function() { 
			$pos = $(this).parent().position();
			$(this).css({top: $pos.top, left: $pos.left, position:'absolute'});
		});

		$(".removeBtn").each(function() { 
			$pos = $(this).parent().position();
			$(this).css({top: $pos.top, left: $pos.left+ 45, position:'absolute'});
		});


		$("#newArticleBtn").unbind("click")
		$("#newArticleBtn").bind("click",newArticleModal);
		
		$("#userAdminBtn").unbind("click")
		$("#userAdminBtn").bind("click",newAdminModal);

		$(".adminBtn").click(showAdminOpts);
		$(".removeBtn").click(removeElement);
	}


	var getAdminModal = function()
	{
		if (getCookie("Auth") == null)
			$('#adminLoginModal').modal({ show : true, backdrop: false});

		else 
			setAdminMode();
	}

	var loginAdmin = function(e)
	{
		e.preventDefault();
		var username = dom.loginUsername.value;
		var passwd = dom.loginPasswd.value;

		if (!lock && username.length > 0 && passwd.length > 0) { 
			lock = true;
			$.ajax({
				url : "//"+window.location.host+"/usuario/login.json",
				type: "POST",
				data: { username: username , password: passwd },
				success: function(data)
				{
					lock = false;
					console.log(data);
					if (data.login) 
					{
						$("#adminLoginModal").modal("hide");
						setAdminMode();
					}
				},
			});
		}
	}



	var checkHash = function()
	{
		var url = window.location.hash;
		var hash = url.substring(url.indexOf('#')); 
		if (hash == "#admin")
		{
			getAdminModal();
		}
	}	


	var __init__ = function()
	{
		$(dom.adminLoginForm).submit(loginAdmin);
		setListeners();
		checkHash();
	}

	var renderImage = function(img)
	{
		$("#imgArticle").attr('src',"//" + window.location.host + "/images/" + img);
		imgFile = img;
	}

	var setListeners = function()
	{
		$(window).on('hashchange',checkHash);

		$("#imgArticleUpload").fileUpload({
		      url: ["//",window.location.host,"/img/save/img"].join(""),
		      type: 'POST',
		      imageType : 'jpeg',
		      //imageMaxHeight: 500,
		      //imageMaxWidth: 500,
		      //allowUploadOriginalImage: true,  // Webkit browsers need one of these two settings to work.
		      allowDataInBase64: true,           // (Fallback to original file, or send the resized in base64)
		      //forceResize: true,
		      beforeSend: function () {
		        //$(dom.ajaxuploading).fadeIn();
		      },
		      complete: function () {
		        //$(dom.ajaxuploading).fadeOut();
		      },
		      success: function (data, status, xhr) {
					if (data.file != undefined)
					{
						renderImage(data.file);
					}
		      }
		});
	}

	__init__();
};


var dom_admin = {
	adminLoginForm : document.getElementById("adminLoginForm"),
	loginUsername : document.getElementById("loginUsername"),
	loginPasswd : document.getElementById("loginPasswd")
};


var admin = new admin(dom_admin);