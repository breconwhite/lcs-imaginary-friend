var positions = Array();
var remaining = Array();
var pickNum = 10;

var chosen = Array();
var allPlayers = Array();

$(document).ready(getList());

function getList(){
	$.ajax({
		type: "GET",
		url: "players.csv",
		success: function(data){ sortPlayers(data); }
	});
}

function sortPlayers(data){
	var splitRoles = data.split("\n");

	for (var i = splitRoles.length - 1; i >= 0; i--) {
		var players = splitRoles[i].split(",");
		positions.push(players);
		remaining.push(players);

		var justPlayers = Array();
		for (var j = players.length - 1; j >= 0; j--) {
			justPlayers[j] = players[j];
		};
		justPlayers.splice(0,1);
		allPlayers = allPlayers.concat(justPlayers);
	};

	$("#playerRemover").autocomplete({
	 	source: function (request, response) {
	        var matches = $.map(allPlayers, function (acItem) {
	            if (acItem.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
	                return acItem;
	            }
	        });
	        response(matches);
 		}
	});
}

function rollPicks(){
	if(pickNum > 0){
		
		if(remaining.length < 1){
			for (var i = positions.length - 1; i >= 0; i--) {
				remaining[i] = positions[i];
			};
			remaining.splice(0,1);
		}

		posPick = Math.floor((Math.random() * remaining.length));
		var pickedPosition = remaining[posPick];

		playPick = Math.floor((Math.random() * remaining[posPick].length-1)+2);
		
		console.log(pickedPosition, playPick);

		//SUBMIT PICK
		var result = Array(pickedPosition[playPick],pickedPosition[0]);
		chosen.push(result);

		$("#playerDrafter").html("<h2>"+result[0]+" playing "+result[1]+"</h2>");

		//REMOVE ROLLS
		remaining.splice(posPick,1);
		pickNum --;
	}
	else{
		var resultString = "";
		for (var i = chosen.length - 1; i >= 0; i--) {
			resultString += "<li>"+chosen[i][1]+" - "+chosen[i][0]+"</li>"; 
		};
		$("#playerDrafter").html(resultString);
	}
}

function removePlayer(){
	var removed = $("#playerRemover").val();

	var al = allPlayers.indexOf(removed);
	if(al != null && al >= 0){
		allPlayers.splice(al,1);
		$("#removedPlayers").append("<li>"+removed+"</li>");
	}

	console.log(remaining);
	for (var i = remaining.length - 1; i >= 0; i--) {
		var a = remaining[i].indexOf(removed);
		if(a != null && a >= 0){
			remaining[i].splice(a,1);
		}
	};	
	for (var i = positions.length - 1; i >= 0; i--) {
		var a = positions[i].indexOf(removed);
		if(a != null && a >= 0){
			positions[i].splice(a,1);
		}
	};
	$("#playerRemover").val("");
}