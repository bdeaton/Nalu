var nalusCore = window.nalusCore || {};
nalusCore.App = nalusCore.App || {};

var iUserId      = 0;
var sNickName    = '';
var sFirstName   = '';
var sLastName    = '';
var dAccDate     = '';
var sEmail       = '';
var sAccessToken = '';
var sUUID		 = '';
var sGateWay  = 'http://cpptl.co/apps/nalus';

nalusCore.App = {

	debug: true,
		
	init: function(){
		console.log('application init');
		if(this.debug){
			device = {uuid:'UUID:BCD'};	
		}
		this.setupApp();
		nalusCore.App.genQR();
	},	
	
	setupApp: function( ){
		console.log( 'setupApp' );
		this.setupHandlers();
		nalusCore.App.retrieveAll();
	},
	
	setupHandlers: function( ){
		console.log( 'setupHandlers' );
		$('#form-login').on('submit',function(e) {
			e.preventDefault();
			nalusCore.App.loginHandler();
		});
		$("#form-register").on('submit',function(e) {
			e.preventDefault();
			nalusCore.App.registrationHandler();
		});
		$("#btn-logout").on('click',function() {
			nalusCore.App.logoutHandler();
		});

		$("#btn-friends-send").on('click',function(){
			if($("#input-friends-phone").val()==''){
				alert( 'Please fill out a phone number', 'Error', 'Ok' );
				return false;
			}
			else {
				alert('send sms');				
				//intel.xdk.device.sendSMS(bodyText, $("#input-friends-phone").val() );
				return false;
			}
		});

		$("#btn-friends-browse").on('click',function(){
			alert('choose contact');
			//document.addEventListener('intel.xdk.contacts.choose', nalusCore.App.onChooseContact);
			//intel.xdk.contacts.chooseContact();
			return false;
		});

	},
	
	onChooseContact:function(evt){
		if (evt.success){
			var contactInfo = intel.xdk.contacts.getContactData(evt.contactid);
			alert( JSON.stringify( contactInfo ), 'Info Debug', 'Ok' ); 
			$("#input-friends-phone").val(contactInfo.phones[0]);
			  
			$.ajax({
				type: 'POST',
				url: sGateWay + "/v1/users?method=addUser",
				data: { 
					user_id: Redcurb.Helpers.getCookie('userId'),
					phone_number: contactInfo.phones[0],
					message: 'Message',
					code: 'Code'
				},
				success: function(data){ 
					if(data.success){
						sSpecialHtml += '<li class="widget uib_w_23" data-uib="jquery_mobile/listitem" data-ver="0">';
						sSpecialHtml +='<h2>'+value.special_name+'</h2>';
						sSpecialHtml +='<p>'+value.description+'</p>';
						sSpecialHtml +='<p class="ui-li-aside">'+value.expiration_date+'</p>';
						sSpecialHtml +='</li>';
						console.log(sSpecialHtml);
					}
				}
			});
		}
		else if(evt.cancelled){
			alert("Choose Contact Cancelled");
		}
		
	},
	
	logoutHandler: function(){
		alert( 'You have been logged out!', 'Nalus', 'Ok' );
	},
	
	registrationHandler: function(){
		console.log('registrationHandler');

		// Registration / Form validation (simple)
		if($("#register-first").val() == '' || $("#register-last").val() == '' || $("#register-email").val() == '' || $("#register-phone").val() == '' || $("#register-zip").val() == '' || $("#register-password").val() == ''){
        	alert( 'Please fill out all fields', 'Error', 'Ok' ); 
		}
		
		// Ajax call for registration
		$.ajax({
            type     : 'POST',
            dataType : 'json',
            url      : sGateWay + "/v1/users?method=addUser",
            data	 : { 
            	phone_number: $("#register-phone").val(),
            	password: $("#register-password").val(),
            	email: $("#register-email").val(),
            	nickname: $("#register-first").val() + " " + $("#register-last").val(),
            	firstname: $("#register-first").val(),
            	lastname: $("#register-last").val(),
            	zipcode: $("#register-zip").val(),
            	code: $("#register-code").val(),
            	uuid: device.uuid
            },
            success  : function(data){ 
            	if(data.success){
            		Redcurb.Helpers.setCookie('lockdownMode', true, -1);
        		}
        		else{
                	alert( 'Could not Join...', 'Error', 'Ok' ); 
        		}
           	}
        });
		
	},

	loginHandler: function(){
		console.log( 'loginHandler' );
		if($("#login-phone").val() == '' || $("#login-password").val() == '' ){
        	alert( 'Please fill out both fields', 'Error', 'Ok' ); 
		}
		$.ajax({
			type     : 'POST',
			dataType : 'json',
			url      : sGateWay + "/v1/users?method=login",
			data	 : { 
				phone_number: $("#loginPhoneFld").val(),
				password: $("#loginPassFld").val(),
				uuid: device.uuid,
			},
			success: function(data){ 
				if( data.success == true ){
					// Token
					sAccessToken = data.payload.accessToken;
					iUserId = data.payload.userId;
					sFirstName = data.payload.firstName;
					sLastName = data.payload.lastName;
					dAccDate = data.payload.memberSince;
					sEmail = data.payload.email;
					sUUID = data.payload.uuid;

					Redcurb.Helpers.setCookie( 'accessToken', sAccessToken, -1 );
					Redcurb.Helpers.setCookie( 'userId', iUserId, -1 );
					Redcurb.Helpers.setCookie( 'firstName', sFirstName, -1 );
					Redcurb.Helpers.setCookie( 'lastName', sLastName, -1 );
					Redcurb.Helpers.setCookie( 'dAccDate', dAccDate, -1 );
					Redcurb.Helpers.setCookie( 'email', sEmail, -1 );
					Redcurb.Helpers.setCookie( 'uuid', sUUID, -1 );
					
					// Show we throw an alert?.. for now we do.
					alert( 'Logged in!', 'Nalus', 'Ok' ); 

					nalusCore.App.genQR();
					$.mobile.changePage('#home');
				}
				else {
					alert( 'Could not log you in', 'Error', 'Ok' ); 
				}
			}
		});
	},
	
	retrieveAll: function(){
		nalusCore.App.retrieveFriends();
		nalusCore.App.retrieveSpecials();
		nalusCore.App.retrieveTransactions();
		nalusCore.App.retrieveAccounts();
	},
	
	retrieveFriends: function(){
		// Receive Specials
		$.ajax({
            type: 'POST',
            url: sGateWay + "/v1/nalus?method=pullFriends",
            dataType: 'json',
            data:{ 
            	uuid: Redcurb.Helpers.getCookie('userId'),
            },
            success: function(data){ 
            	if(data.success){
			 		sFriendsHtml = '';
					$.each(data.payload, function(key, value){
						sFriendsHtml += value.friend_name+' ( ' + value.phone_number + ' )';
						sFriendsHtml += value.status;
				    });
					console.log(sFriendsHtml);
        		}
            }
		});
	},
	
	retrieveSpecials: function(){
		$.ajax({
            type: 'POST',
            url: sGateWay + "/v1/nalus?method=pullSpecials",
            dataType: 'json',
            data: {},
            success:function(data){ 
            	if(data.success){
            		sSpecialHtml = '';
            		$.each(data.payload, function(key, value){
            			sSpecialHtml +=value.special_name;
            			sSpecialHtml +=value.description;
            			sSpecialHtml +=value.expiration_date;
            	    });
            		console.log(sSpecialHtml);
        		}
        		else{
        			alert( 'Server Error....' );
        		}
            }
		});
	},
	
	retrieveTransactions: function(){
		$.ajax({
            type: 'POST',
            url: sGateWay + "/v1/nalus?method=pullTransactions",
            dataType: 'json',
            data: { 
            	uuid: Redcurb.Helpers.getCookie( 'userId' ),
            },
            success: function(data){ 
            	if(data.success){
            		sAccountsHtml = '';
            		$.each(data.payload,function(key, value){
            			sAccountsHtml += value.recdate+' - ' + value.type;
            			sAccountsHtml += value.value;
            	    });
            		console.log(sAccountsHtml);
        		} else {
        			alert( 'Server Error....' );
        		}
            }
		});
		
	},
	
	retrieveAccounts: function(){
		$.ajax({
            type: 'POST',
            url: sGateWay + "/v1/nalus?method=pullAccounts",
            dataType: 'json',
            data: { 
            	uuid: Redcurb.Helpers.getCookie( 'userId' )
            },
            success: function(data){ 
            	if(data.success){
            		console.log('accTotal: ' + data.payload.account_total);
            		console.log('vipTotal: ' + data.payload.vip_total);
            		console.log('giveTotal: ' + data.payload.give_total);
        		}
        		else{
        			alert( 'Server Error....' );
        		}
            }
		});
		
	},

	checkToken: function(){
		alert(Redcurb.Helpers.getCookie('accessToken'));
		return true;
	},

	validateUser: function(){
		Redcurb.Helpers.setCookie('lockdownMode', false, -1);
	},

	genQR: function(){
		console.log( 'genQR' );
		var cookieUUID = Redcurb.Helpers.getCookie('uuid');
		cookieUUID = "376873876383";
		var qrWidth = $('em.barcode').css('width').replace('px','');
		var qrHeight = qrWidth;
		if(cookieUUID==''){
			alert('no uuid');
		}
		else {
			console.log('create QR');
			var options = {text:cookieUUID,width:qrWidth,height:qrHeight};
			var showOptions = {effect:'bounce',duration:1000,easing:'easeInBounce',complete:function(){}}
			$('.barcode').qrcode(options).show(showOptions);
			//new QRCode( document.getElementById("qrcode"), cookieUUID );
		}
	}
	
};
$(function() {
	nalusCore.App.init();
	//alert( app );
});