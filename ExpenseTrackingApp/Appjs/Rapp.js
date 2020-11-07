var sampleApp = angular.module('sampleApp', ['ngAnimate','ngRoute','ngStorage', 'ui.bootstrap','ngMaterial','ngMessages']);

sampleApp.config(['$routeProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider. when('/', {
			templateUrl: 'Templates/Login.html',
			controller: 'LoginController'
		}).
		when('/login', {
			templateUrl: 'Templates/Login.html',
			controller: 'LoginController'
		}).
		when('/registerRoom', {
			templateUrl: 'Templates/Roomregister.html',
			controller: 'roomregisterController'
		}).
		when('/registerPerson', {
			templateUrl: 'Templates/PersonRegister.html',
			controller: 'PerRegisterController'
		}).
		when('/loggedin',{
			templateUrl: 'Templates/AddSpend.html',
			controller: 'AddSpenController',
			controllerAs: 'addspen'
		}).when('/showReport',{
			templateUrl: 'Templates/UserReport.html',
			controller: 'userreportController'
		}).when('/addSpen',{
			templateUrl: 'Templates/AddSpend.html',
			controller: 'AddSpenController',
			controllerAs: 'addspen'
		}).when('/UserReport',{
			templateUrl: 'Templates/UserReport.html',
			controller: 'userreportController',
			controllerAs: 'addspen'
		}).when('/PersonMonthReport',{
			templateUrl: 'Templates/PersonMonthReport.html',
			controller: 'personmonthController',
			controllerAs: 'addspen'
		}).when('/RoomReport',{
			templateUrl: 'Templates/RoomReport.html',
			controller: 'roomreportController',
			controllerAs: 'addspen'
		}).when('/logout',{
			templateUrl: 'Templates/Login.html',
			controller: 'LoginController'
		}).when('/editSpend',{
			templateUrl: 'Templates/editSpend.html',
			controller: 'editspendcontroller'
		}).when('/regmonth',{
			templateUrl: 'Templates/regmoney.html',
			controller: 'regmonthcontroller'
		});
	}]);


sampleApp.controller('homecontroller', function($scope ,$http, $rootScope,$location, $localStorage ){

	if($localStorage.user!="undefined"){
		if($localStorage.user!=""){
		$location.path("/addSpen");
	}
		$location.path("/login");
	}else{
		$location.path("/login");
	}
	console.log("dfgrreygerhgre")
	console.log($localStorage.user)
	
	$scope.status = {
		isopen: false
	};
	$scope.toggled = function(open) {
		$log.log('Dropdown is now: ', open);
	};
	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};
	$scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
	$scope.sideclass = 'side'
	$scope.myFunction = function(){
		if($scope.sideclass=='side'){
			$scope.sideclass='sideopen';
		}else{
			$scope.sideclass='side';
		}
	}
	$rootScope.display = false;
  $localStorage.roomid = 1;
  $localStorage.personid = 1;
  $scope.changeroomid = function(){
  	$localStorage.roomid=$scope.roomid;
  };
  $scope.changepid = function(){
  	$localStorage.personid =$scope.personid;
  };
});


sampleApp.controller('roomregisterController', function($scope ,$location, $http,$localStorage){
	$scope.room = {"Roomname":"","Address":""};
	$scope.disproomerr = false;
	$scope.checkRoomExists = function(){
		var givenroom = $scope.room.Roomname;
		$http.get("https://noderoomserver.herokuapp.com/"+givenroom).then(function(response) {
			$scope.roomdetailsList = response.data;
			if($scope.roomdetailsList.length!=0){
				$scope.disproomerr =true;
			}else{
				$scope.disproomerr = false;
			}
		});
		$scope.clearerror = function(){
			$scope.disproomerr = false;
		};
	};
	$scope.registerRoom = function(){
		console.log($scope.room);
		$scope.jsonObj = angular.toJson($scope.room,false);
		var response = $http.post("https://noderoomserver.herokuapp.com/room",$scope.jsonObj);
		response.success(function(){
			alert("Room registered sucessfully");
			$scope.room={"Roomname":"","Address":""};
			$location.path("/registerPerson");
		});
		response.error(function(){
			alert("Error while registering room");
		});
	};
});

sampleApp.controller("PerRegisterController",function($scope ,$location, $http,$localStorage){
	$scope.person = {"username":'',"userid":"","roomname":"","password":""};
	$scope.disproomerr = false;
	$http.get("https://noderoomserver.herokuapp.com/room").then(function(response) {
		$scope.roomdetailsList = response.data;
	});
	$scope.checkUserExists=function(){
		var givenPerson = $scope.person.userid;
		$http.get("https://noderoomserver.herokuapp.com/user/"+givenPerson).then(function(response) {
			$scope.persondetailsList = response.data;
			if($scope.persondetailsList.length!=0){
				$scope.disproomerr =true;
			}else{
				$scope.disproomerr = false;
			}
		});
		$scope.clearerror = function(){
			$scope.disproomerr = false;
		};	
	};
	$scope.RegisterPerson= function(){
		$scope.jsonObj = angular.toJson($scope.person,false);
		var response = $http.post("https://noderoomserver.herokuapp.com/user",$scope.jsonObj);
		if(response.success){
			alert("User Registerd Sucessfully");
			$scope.person = {"username":'',"userid":"","roomname":"","password":""};
			$location.path("/login");			
		}else{
			alert("Error in Registering User")
		}
};
});

sampleApp.controller("LoginController",function($scope , $rootScope , $http , $localStorage , $location){
	
	$scope.person = {"username":'',"userid":"","roomname":"","password":""};
	$localStorage.user = ''
	$localStorage.monthid = ''
	$scope.Login = function(){
		$scope.jsonObj = angular.toJson($scope.person,false);
		$http.post("https://noderoomserver.herokuapp.com/authenticate",$scope.jsonObj).then(function(response) {
			if(response.data.success){
				$localStorage.user = response.data;
				var d = new Date();
				$scope.monthid = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+$localStorage.user.roomname;
				$localStorage.monthid = $scope.monthid;
				$rootScope.display = false;
				$location.path("/loggedin");
			}else{
				alert(response.data.message);
			}
		});
	};
});


sampleApp.controller("regmonthcontroller",function($scope , $http,$localStorage,$location){
	if($localStorage.user==""){
		$location.path("/");
	}
	$scope.username=$localStorage.user.username
	$scope.monthid =$localStorage.monthid
	$scope.monthdetails = {'Amount':'','MonthId':''};
	var d = new Date()
	$scope.MonthId = d
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};
	$scope.popup1 = {
		opened: false
	};
	$scope.registeramount = function(){
		var month_id =  $scope.MonthId.getFullYear()+"-"+(($scope.MonthId.getMonth())+1)+"-"+$localStorage.roomid;
		$http.get("https://noderoomserver.herokuapp.com/month?monthid="+month_id).then(function(response) {
			console.log(response.data.length)
			if(response.data.length!=0){
				alert("Month already Registered")
			}else{
				$scope.monthdetails.MonthId = month_id;
				$scope.monthdetails.Amount = $scope.Amount;
				$scope.jsonObj = angular.toJson($scope.monthdetails,false);
				var response = $http.post('https://noderoomserver.herokuapp.com/month',$scope.jsonObj);
				response.success(function(){
					alert("Month Registered Sucessfully");
				});
				response.error(function(){
					alert("Error in Month Registering");
				});
			}
		});
};
});


sampleApp.controller("editspendcontroller",function($scope ,$rootScope, $http,$localStorage,$location){
	if($localStorage.user==""){
		$location.path("/");
	}
	$scope.spendtoedit = $rootScope.itemtoedit
	$scope.username=$localStorage.user.username
	$scope.monthid =$localStorage.monthid
	$scope.add = function(){
		$scope.spendtoedit.items.push({'item':'','amount':''});
	};
	$scope.remove = function(index){
		$scope.spendtoedit.items.splice(index, 1); 
		$scope.calcAmount()
	};
	$scope.calcAmount= function(){
		$scope.spendtoedit.totalamount=0
		for(i=0;i<$scope.spendtoedit.items.length;i++){
			$scope.spendtoedit.totalamount+=$scope.spendtoedit.items[i].amount;
		}
	};
	$scope.editprice = function addprice(){
		$scope.jsonObj = angular.toJson($scope.spendtoedit, false);
		var response = $http.put("https://noderoomserver.herokuapp.com/updateitem?id="+$scope.spendtoedit._id, $scope.jsonObj);
		if(response.success){
			alert("Item Updated Sucessfully");
			$location.path("/UserReport");
		}
		else{
			alert("Error in Updating Item")
		}
} ;
});


sampleApp.controller('AddSpenController', function($scope,$location, $http,$rootScope,$localStorage) {

	
	if($localStorage.user==""){
		$location.path("/");
	}
	$rootScope.display = false;
	$scope.status = {
		isopen: false
	};
	$scope.amountstatus = 'posamount'
	$scope.toggleDropdown = function($event) {
		$scope.status.isopen = !$scope.status.isopen;
	};
	$scope.username=$localStorage.user.username
	$scope.monthid =$localStorage.monthid
	$scope.listDetails={"userid = ":'',"roomname":'',"items":[{'item':'','amount':''}],'totalamount':0,'monthId=':''}
	$http.get("https://noderoomserver.herokuapp.com/month?monthid="+$localStorage.monthid).then(function(response) {
		$scope.monthdetailslist = response.data;
		if($scope.monthdetailslist.length==0){
			alert("Register Amount for this month")
		}
		$http.get("https://noderoomserver.herokuapp.com/monthitems/"+$localStorage.monthid).then(function(response) {
			$scope.totalspenddetails = response.data.content;
			$scope.roomamount = 0;
			$scope.actualamount=0;
			for(j=0; j<$scope.totalspenddetails.length ;j++){
				for(k=0; k<$scope.totalspenddetails[j].items.length;k++){
					$scope.roomamount = $scope.roomamount+$scope.totalspenddetails[j].items[k].amount;
				}
			}
			for(l=0; l<$scope.monthdetailslist.length;l++){
				$scope.actualamount = $scope.actualamount+$scope.monthdetailslist[l].Amount;
			}
			$scope.remainingAmount = $scope.actualamount-$scope.roomamount;
			if($scope.remainingAmount<0){
				$scope.amountstatus = 'negamount'
			}
			$scope.dupremainingAmount = $scope.remainingAmount
		});       
	});
$scope.add = function(){
	$scope.listDetails.items.push({'item':'','amount':''});
};
$scope.remove = function(index){
	$scope.listDetails.items.splice(index, 1); 
	$scope.calcAmount()
};
$scope.calcAmount= function(){
	$scope.listDetails.totalamount = 0;
	for(i=0;i<$scope.listDetails.items.length;i++){
		if($scope.listDetails.items[i].amount>0){
			$scope.listDetails.totalamount+=$scope.listDetails.items[i].amount;
		}
		console.log($scope.listDetails.totalamount)
	}
	if($scope.listDetails.totalamount>0){
		$scope.remainingAmount=$scope.dupremainingAmount
		$scope.remainingAmount = $scope.remainingAmount-$scope.listDetails.totalamount
		if($scope.remainingAmount<0){
			alert("amount is going low")
		}
	}else{
		$scope.listDetails.totalamount = 0;
		$scope.remainingAmount=$scope.dupremainingAmount
	}
};
$scope.addPrice = function addprice(){
	$scope.listDetails.userid = $localStorage.user.userid
	$scope.listDetails.roomname=$localStorage.user.roomname
	$scope.listDetails.monthId=$localStorage.monthid
	$scope.jsonObj = angular.toJson($scope.listDetails, false);
	var response = $http.post('https://noderoomserver.herokuapp.com/item', $scope.jsonObj);
	if(response.success){
		$scope.listDetails={"userid = ":'',"roomname":'',"items":[{'item':'','amount':''}],'totalamount':0,'monthId=':''}
		alert("Items Added Successfully");
		$location.path("/UserReport");
	}
	else{
		alert("Error in Adding Items");
	}
} ;
});




sampleApp.controller('userreportController', function($scope,$http,$uibModal,$rootScope,$localStorage,$mdDialog, $mdMedia,$location) {
	if($localStorage.user==""){
		$location.path("/");
	}

	$scope.selected = {};
	$scope.modalclass = 'modal-close'
	$scope.username=$localStorage.user.username
	$rootScope.display = true;
	$http.get("https://noderoomserver.herokuapp.com/getdefaultreport?userid="+$localStorage.user.userid+"&monthId="+$localStorage.monthid).then(function(response) {
		$scope.userreport = response.data.content;
	});
$scope.editSpend = function (spend) {  
	console.log("in edit")
	$rootScope.itemtoedit = spend
	$location.path("/editSpend");
};   
	$scope.updateSpend = function(spend,index){
		var userspend  = $scope.userreport[index];
		$scope.jsonObj = angular.toJson(userspend, false);
		var response = $http.put("https://noderoomserver.herokuapp.com/updateitem?id="+userspend._id, $scope.jsonObj);
		response.success(function(data) {
			$scope.status = data;
		});
	};
	$scope.deleteSpend = function(spend,index){
		var userspend  = $scope.userreport[index];
		var response = $http.delete('https://noderoomserver.herokuapp.com/deleteitem?id='+userspend._id);
		$scope.userreport.splice(index, 1)
};
$scope.reset = function () {  
	$scope.selected = {};  
}; 

});


sampleApp.controller('roomreportController', function($scope,$http,$rootScope,$localStorage) {
	if($localStorage.user==""){
		$location.path("/");
	}
	$scope.username=$localStorage.user.username
	$rootScope.display = true;
	$scope.sortType     = 'name'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchFish   = '';  
  $scope.open1 = function() {
  	$scope.popup1.opened = true;
  };
  $scope.popup1 = {
  	opened: false
  };

  $http.get("https://noderoomserver.herokuapp.com/getroomreport?roomname="+$localStorage.user.roomname+"&monthId="+$localStorage.monthid).then(function(response) {
  	$scope.roomspendreport = response.data.content;
  });

  $scope.generatereport = function(){
  	var d= $scope.selectedmonth;
  	$scope.monthid = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+$localStorage.user.roomname;
  	$http.get("https://noderoomserver.herokuapp.com/getroomreport?roomname="+$localStorage.user.roomname+"&monthId="+$scope.monthid).then(function(response) {
  		$scope.roomspendreport = response.data.content;
  	});
  }
});

sampleApp.controller('personmonthController', function($scope,$http,$rootScope,$localStorage) {
	$scope.username=$localStorage.user.username
	$http.get("https://noderoomserver.herokuapp.com/user").then(function(response) {
		$scope.persons = response.data;
	});

	$rootScope.display = true;
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};
	$scope.popup1 = {
		opened: false
	};
	$http.get("https://noderoomserver.herokuapp.com/getpersonmonthreport?userid="+$localStorage.user.userid+"&monthId="+$localStorage.monthid).then(function(response) {
		$scope.personspendreport = response.data.content;
	});

	$scope.generatereport = function(){
		if($scope.selectedperson==undefined){
			var d= $scope.selectedmonth;
			$scope.monthid = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+$localStorage.user.roomname;
			$http.get("https://noderoomserver.herokuapp.com/getpersonmonthreport?userid="+$localStorage.user.userid+"&monthId="+$scope.monthid).then(function(response) {
				$scope.personspendreport = response.data.content;
			});
		}else if($scope.selectedmonth==undefined){
			$http.get("https://noderoomserver.herokuapp.com/getpersonmonthreport?userid="+$scope.selectedperson+"&monthId="+$localStorage.monthid).then(function(response) {
				$scope.personspendreport = response.data.content;
			});
		}else{
			var d= $scope.selectedmonth;
			$scope.monthid = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+$localStorage.user.roomname;
			$http.get("https://noderoomserver.herokuapp.com/getpersonmonthreport?userid="+$scope.selectedperson+"&monthId="+$scope.monthid).then(function(response) {
				$scope.personspendreport = response.data.content;
			});
		}	
	}
});




/*https://noderoomserver.herokuapp.com/room*/