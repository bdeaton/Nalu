/**
 * Nalus.js
 * @type Javascript Core File
 * @author Oscar Frowijn
 * @copyright RedCurb Solutions, LLC.
 * 
 */

var nalusCore = {};
nalusCore.App = nalusCore.App || {};

var iUserId      = 0;
var sNickName    = '';
var sFirstName   = '';
var sLastName    = '';
var dAccDate     = '';
var sEmail       = '';
var sAccessToken = '';
var sUUID		 = '';

// Site Dev/Prod
var sGateWay  = 'http://cpptl.co/apps/nalus';

//alert( 'here ');

// Application Object
nalusCore.App = {

	debug: true, // Set to false when deploying...
		
	init: function(){
		if( this.debug == true ) console.log('application init');
		
		// Setup Application Handler
		this.setupApp();
		
		// Verify Token and generate a QR
		if ( this.checkToken() == true )
		{
			// Generate a QR code which is cached.
			this.genQR();
			this.retrieve();
		} else {
			// Bounce to login?
		}
	},	
	
	genQR: function(){
		if( this.debug == true ) console.log( 'genQR' );
		
		if( intel.xdk.cache.getCookie( 'uuid' ) == undefined )
		{
			$("#qrcode").html( 'Please Register or Login' );
		} else {
			$("#qrcode").html( '' );
			new QRCode( document.getElementById("qrcode"), intel.xdk.cache.getCookie( 'uuid' ) );
		}
	},
	
	checkToken: function(){
		if( this.debug == true ) console.log( 'checkToken started' );
		// Validates a user token from cache to server
		//alert( 'here' );
		//alert( intel.xdk.cache.getCookie( 'accessToken' ) );
		
		return true;
	},
	
	loginHandler: function()
	{
		if( this.debug == true ) console.log( 'loginHandler' );
		// Form validation
		if( $("#loginPhoneFld").val() == '' || 
			$("#loginPassFld").val() == '' )
		{
        	intel.xdk.notification.alert( 'Please fill out both fields', 'Error', 'Ok' ); 
        	return;
		}
		
		
		// Ajax call to server....
		$.ajax({
	            type     : 'POST',
	            url      : sGateWay + "/v1/users?method=login",
	            data	 : { 
	            	phone_number   : $("#loginPhoneFld").val(),
	            	password	   : $("#loginPassFld").val(),
	            	uuid           : intel.xdk.device.uuid,
	            },
	            success  : function(data){ 
	            	if( data.success == true )
            		{
	            		// Token
	            		sAccessToken = data.payload.accessToken;
	            		intel.xdk.cache.setCookie( 'accessToken', data.payload.accessToken, -1 );
	            		
	            		// UserID
	            		iUserId = data.payload.userId;
	            		intel.xdk.cache.setCookie( 'userId', data.payload.userId, -1 );
	            		
	            		// Firstname
	            		sFirstName = data.payload.firstName;
	            		intel.xdk.cache.setCookie( 'firstName', data.payload.firstName, -1 );
	            		
	            		// LastName
	            		sLastName = data.payload.lastName;
	            		intel.xdk.cache.setCookie( 'lastName', data.payload.lastName, -1 );
	            		
	            		// AccountDate
	            		dAccDate = data.payload.memberSince;
	            		intel.xdk.cache.setCookie( 'dAccDate', data.payload.memberSince, -1 );
	            		
	            		// Email
	            		sEmail = data.payload.email;
	            		intel.xdk.cache.setCookie( 'email', data.payload.email, -1 );
	            		
	            		// Email
	            		sEmail = data.payload.email;
	            		intel.xdk.cache.setCookie( 'email', data.payload.email, -1 );

	            		// UUID
	            		sUUID = data.payload.uuid;
	            		intel.xdk.cache.setCookie( 'uuid', data.payload.uuid, -1 );
	            		
	            		// Show we throw an alert?.. for now we do.
		            	intel.xdk.notification.alert( 'Logged in!', 'Nalus', 'Ok' ); 

		            	// Generate QR code
		            	nalusCore.App.genQR();
		            	
		            	// Route to QR page
		            	$("#mmHomeBtn").click();
		            	
            		} else {
    	            	intel.xdk.notification.alert( 'Could not log you in', 'Error', 'Ok' ); 
            			
            		}
            	},
	            dataType : 'json'
	        });
	},
	
	logoutHandler: function()
	{
		if( this.debug == true ) console.log( 'logoutHandler' );
		// Ajax call to destroy token
	},
	
	registrationHandler: function()
	{
		if( this.debug == true ) console.log( 'registrationHandler' );

		// Registration / Form validation (simple)
		if( $("#joinFNameFld").val() == '' || 
			$("#joinLNameFld").val() == '' ||
			$("#joinEmailFld").val() == '' ||
			$("#joinPhoneFld").val() == '' ||
			$("#joinZipFld").val() == ''   ||
			$("#joinPassFld").val() == '' )
		{
        	intel.xdk.notification.alert( 'Please fill out all fields', 'Error', 'Ok' ); 
        	return;
		}
		
		
		// Ajax call for registration
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/users?method=addUser",
            data	 : { 
            	phone_number   : $("#joinPhoneFld").val(),
            	password	   : $("#joinPassFld").val(),
            	email	       : $("#joinEmailFld").val(),
            	nickname	   : $("#joinFNameFld").val() + " " + $("#joinLNameFld").val(),
            	firstname	   : $("#joinFNameFld").val(),
            	lastname	   : $("#joinLNameFld").val(),
            	zipcode		   : $("#joinZipFld").val(),
            	uuid           : intel.xdk.device.uuid,
            },
            success  : function(data){ 

            	// Success?
            	if( data.success == true )
        		{
            		// We throw the user in lockdown mode right now...
            		// if the user is in lockdown mode they can only validate...
            		// What if the user put in the wrong number?
            		// notes for self.
            		
            		intel.xdk.cache.setCookie( 'lockdownMode', true, -1 );
            		
            		// TODO: redirect the user here to set lockdown.
            		
            		
            		
            		
        		} else {
                	intel.xdk.notification.alert( 'Could not Join...Email already exists', 'Error', 'Ok' ); 
                	
        		}
           	},
            dataType : 'json'
        });
		
	},
	
	
	validateUser: function ( )
	{
		// Send a Validation Key to the user.	
		
		intel.xdk.cache.setCookie( 'lockdownMode', false,-1 );
		
		
	},
	
	retrieve: function( )
	{
		// Retrieves all data functional and store locally
		
		
		
		// Friend feed, finance feeds, give feeds

		/** Friends **/
		// Receive Specials
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/nalus?method=pullFriends",
            dataType : 'json',
            data	 : 
            { 
            	uuid: intel.xdk.cache.getCookie( 'userId' ),
            },
            success  : function(data){ 
            	if( data.success == true )
        		{
			 		sFriendsHtml = '';
					$.each(data.payload, function( key, value )
					{
						sFriendsHtml += '<li class="widget uib_w_19" data-uib="jquery_mobile/listitem" data-ver="0">';
						sFriendsHtml += '<span>'+value.friend_name+'( ' + value.phone_number + ' ) </span>';
						sFriendsHtml += '<span class="ui-li-count">'+value.status+'<span>';
						sFriendsHtml += '</li>';
				    });
					$("#friendList").html( sFriendsHtml );
        		}
            }
		});
		
		// intel.xdk.cache set storage and test new storage..
		
		// Receive Specials
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/nalus?method=pullSpecials",
            dataType : 'json',
            data	 : { 
            	
            },
            success  : function(data){ 
            	if( data.success == true )
        		{
            		/** Specials **/
            		sSpecialHtml = '';
            		$.each(data.payload, function( key, value )
            		{
            			sSpecialHtml += '<li class="widget uib_w_23" data-uib="jquery_mobile/listitem" data-ver="0">';
            			sSpecialHtml +='<h2>'+value.special_name+'</h2>';
            			sSpecialHtml +='<p>'+value.description+'</p>';
            			sSpecialHtml +='<p class="ui-li-aside">'+value.expiration_date+'</p>';
            			sSpecialHtml +='</li>';
            	    });
            		$("#specialView").html( sSpecialHtml );
        		} else {
        			alert( 'Server Error....' );
        		}
            }
		});
		
		// Retrieve Accounts (Transactions)
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/nalus?method=pullTransactions",
            dataType : 'json',
            data	 : { 
            	uuid	: intel.xdk.cache.getCookie( 'userId' ),
            },
            success  : function(data){ 
            	if( data.success == true )
        		{
            		/** Accounts **/
            		sAccountsHtml = '';
            		$.each(data.payload, function( key, value )
            		{
            			sAccountsHtml += '<li class="widget uib_w_41" data-uib="jquery_mobile/listitem" data-ver="0">';
            			sAccountsHtml += '  <span>'+value.recdate+' - ' + value.type + '</span>';
            			sAccountsHtml += '  <span class="ui-li-count">' + value.value + '</p>';
            			sAccountsHtml += '</li>';
            	    });
            		$("#transActions").html( sAccountsHtml );
        		} else {
        			alert( 'Server Error....' );
        		}
            }
		});
		
		
		// Retrieve Give/Receive
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/nalus?method=pullAccounts",
            dataType : 'json',
            data	 : { 
            	uuid	: intel.xdk.cache.getCookie( 'userId' ),
            },
            success  : function(data){ 
            	if( data.success == true )
        		{
            		$("#accTotal").html(  '$' + data.payload.account_total );
            		$("#vipTotal").html(  '$' + data.payload.vip_total );
            		$("#giveTotal").html( '$' + data.payload.give_total );
        		} else {
        			alert( 'Server Error....' );
        		}
            }
		});
		
		
		
	},
	
	
	setupApp: function( )
	{
		if( this.debug == true ) console.log( 'setupApp' );

		// Setup Ajax and more
		/*
		$.ajaxSettings = {
		            type        : 'POST',
		            beforeSend  : function( ) { $('#modal').show(); $('#fade').show();  },
		            error       : function( ) {  intel.xdk.notification.alert( 'Server error, Please try again later...', 'Error', 'Ok' ); },
		            complete    : function( ) { $('#modal').hide(); $('#fade').hide();  },
		            context     : undefined,
		            timeout     : 0,
		            crossDomain : true,
		        };
		*/
		
		// Attach Handlers to buttons
		$("#loginBtn").click( function() {
			nalusCore.App.loginHandler();
		});
		$("#joinBtn").click( function() {
			nalusCore.App.registrationHandler();
		});
		$("#bffContactsBtn").click( function() {
			document.addEventListener('intel.xdk.contacts.choose', onChooseContact);
			intel.xdk.contacts.chooseContact();
		});
		
		$("#mmSpecialsBtn").click( function( ) {
			//alert( 'spec clikckie' );	
			nalusCore.App.retrieve();
		});
		
		$("#bffInviteBtn").click( function() 
		{
			if( $("#bffNumberFld").val() == '' )
			{
				intel.xdk.notification.alert( 'Please fill out a phone number', 'Error', 'Ok' );		
				return;
			} else {
				var bodyText = 'Hey there!, Please come join me at Nalu\'s !!';            
				intel.xdk.device.sendSMS(bodyText, $("#bffNumberFld").val() );
			}
		});
		
		$("#logoutBtn").click( function() {
			//document.addEventListener('intel.xdk.contacts.choose', onChooseContact);
			intel.xdk.cache.clearAllCookies( );
			$("#qrcode").html( 'Please Register or Login' );
			
			// Shoot a message
			intel.xdk.notification.alert( 'You have been logged out!', 'Nalus', 'Ok' );
			
        	// Route to QR page
        	$("#mmHomeBtn").click();

		});
		
	},
	
};


function onChooseContact( evt )
{
	if (evt.success == true)
	{
		  var contactInfo = intel.xdk.contacts.getContactData( evt.contactid );
		  //intel.xdk.notification.alert( JSON.stringify( contactInfo ), 'Info Debug', 'Ok' ); 
		  $("#bffNumberFld").val( contactInfo.phones[0] );
		  
		  // Submit a friend Request
		// Ajax call for registration
		$.ajax({
            type     : 'POST',
            url      : sGateWay + "/v1/users?method=addUser",
            data	 : { 
            	user_id		   	   : intel.xdk.cache.getCookie( 'userId' ),
            	phone_number	   : contactInfo.phones[0],
            	message	   		   : 'Message',
            	code			   : 'Code',
            },
            success  : function(data){ 
            	if( data.success == true )
        		{
            		// Dump the friend straight into the view
        			sSpecialHtml += '<li class="widget uib_w_23" data-uib="jquery_mobile/listitem" data-ver="0">';
        			sSpecialHtml +='<h2>'+value.special_name+'</h2>';
        			sSpecialHtml +='<p>'+value.description+'</p>';
        			sSpecialHtml +='<p class="ui-li-aside">'+value.expiration_date+'</p>';
        			sSpecialHtml +='</li>';

        			$("#specialView").html( sSpecialHtml );
            		
            		
            		
        		}
            }
		});
		  
		  // Add to list
		  
	} else if (evt.cancelled == true)
	{
	      //alert("Choose Contact Cancelled");
	}
}


$(document).ready( function()
{
	// Check verification status
	
	
	
	// Handler on the menu items for now... until we figure something out better
	$("#mmHomeBtn").on('click', function() { $('#mainMenuBtn').click(); } );
	$("#mmFriendsBtn").on('click', function() { $('#mainMenuBtn').click(); } );
	$("#mmSpecialsBtn").on('click', function() { $('#mainMenuBtn').click(); } );
	$("#mmPaymentsBtn").on('click', function() { $('#mainMenuBtn').click(); } );
	$("#mmGiveBtn").on('click', function() { $('#mainMenuBtn').click(); } );
	$("#mmDevBtn").on('click', function() { $('#mainMenuBtn').click(); } );
});



// Initialize the Application
$(function() {
//	var app = nalusCore.App.init();
//	alert( app );
});