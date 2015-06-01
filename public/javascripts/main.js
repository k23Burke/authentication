$(document).ready(function(){
	console.log('HERE');

	$('#emailforInvite').tokenfield();
});


// var app = angular.module('NoExcuse', ['ui.router', 'ui.bootstrap']);

// app.config(function ($stateProvider) {
// 	$stateProvider.state('home', {
// 		url: '/',
// 		template: '<h1>THIS IS YOUR HOME</h1>',
// 	})

// 	$stateProvider.state('login', {
// 		url: '/login',
// 		template: '<h1>Login Page</h1>'
// 		controller
// 	})
// })

// app.controller('Navigation', function ($scope) {
// 	console.log('IN NAV');
// 	$scope.blah = 'HIGHO';

// })

// app.directive('navbar', function() {
// 	return {
// 		restrict: 'E',
// 		templateUrl: 'templates/navbar.html'
// 	}
// })

$('#monthPicker').change(function(){
	var month = parseInt($(this).val()) + 1;
	var daysnum = daysInMonth(month,2015);
	var html = '';
	for(var i = 1; i <= daysnum; i++) {
		html+= '<option value="'+i+'">'+i+'</option>';
	}
	$('#dayPicker').empty();
	$('#dayPicker').append(html);
})
$('#minuteStart').change(function() {
	console.log('change')
	if($(this).val() < 10) $(this).val('0'+$(this).val())
})

//Month is 1 based
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}