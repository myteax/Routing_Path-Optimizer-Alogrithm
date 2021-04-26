var XMAX = getXMAX();  // Get the XMAX value
var YMAX = getYMAX();  // Get the YMAX value

var flag = [];  // Define a flag array(2-dimensional array) of positions

// Set the flag of all positions as "No"(refers to "Not Visited")
for (var i = 0; i < XMAX; i++) {
	var temp = [];
	for (var j = 0; j < YMAX; j++) {
		temp[j] = "No";
	}
	flag[i] = temp;
}

const topmost = 0;  // top of the Heaps
const parent = i => ((i + 1) >>> 1) - 1;  // parent node in Heaps
const left = i => (i << 1) + 1;  // left node of parent in Heaps
const right = i => (i + 1) << 1;  // right node of parent in Heaps


// Define the priority queue(just like C/C++ STL Library) using Heaps
class PriorityQueue {
	constructor(comparator = (a, b) => a.cost < b.cost) {
		this._heap = [];
		this._comparator = comparator;
	}
	size() {
		return this._heap.length;
	}
	isEmpty() {
		return this.size() == 0;
	}
	peek() {
		return this._heap[topmost];
	}
	push(...values) {
		values.forEach(value => {
			this._heap.push(value);
			this._shiftUp();
		});
		return this.size();
	}
	pop() {
		var poppedValue = this.peek();
		var bottom = this.size() - 1;
		if(bottom > topmost) {
			this._swap(topmost, bottom);
		}
		this._heap.pop();
		this._shiftDown();
		return poppedValue;
	}
	replace(value) {
		var replacedValue = this.peek();
		this._heap[topmost] = value;
		this._shiftDown();
		return replacedValue;
	}
	_greater(i, j) {
		return this._comparator(this._heap[i], this._heap[j]);
	}
	_swap(i, j) {
		[this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
	}
	_shiftUp() {
		var node = this.size() - 1;
    	while (node > topmost && this._greater(node, parent(node))) {
      		this._swap(node, parent(node));
      		node = parent(node);
    	}
	}
	_shiftDown() {
		var node = topmost;
    	while ((left(node) < this.size() && this._greater(left(node), node)) || (right(node) < this.size() && this._greater(right(node), node)))
    	{
      		var maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      		this._swap(node, maxChild);
      		node = maxChild;
    	}
	}
}

	// Define the getRoute function to get the optimal path of minimal cost. The format of this function is:  string getRoute(var startX, var startY, var endX, var endY)

function getRoute(startX, startY, endX, endY)
{
	var initial_dist = {x:startX, y:startY, cost:0, path:""};  // Set the initial value(start point information)
	var queue = new PriorityQueue();  // Create a new priority queue
	queue.push(initial_dist);  // Push the initial value(start point information)
	// console.log(queue);

	while(!queue.isEmpty())
	{
		var current = queue.peek();
		console.log(current);
		console.log(flag[current.x][current.y]);

		// If you reach the destination, go out of the loop and return the path value
		if(current.x == endX && current.y == endY)
			break;

		// If you've ever visited this position, continue the loop. If not, set the flag of this position from "No" to "Yes"
		if(flag[current.x][current.y] == "Yes") {
			queue.pop();
			continue;
		}
			
		else
			flag[current.x][current.y] = "Yes";  // Set the flag as "Yes" if you've never visited this position

		queue.pop();  // Remove the current from the Queue

		// Go to the next positions if possible
		if(canGoEast(current.x, current.y))   // Go to the East if possible
		{
			var x = current.x;
			var y = current.y;
			var cost = current.cost;
			var path = current.path;

			var prev_elevation = getElevation(x, y);
			var new_elevation = getElevation(x+1, y);

			var step_cost = get_step_cost(prev_elevation, new_elevation);
			cost += step_cost;
			path += "E";

			queue.push({x:x+1, y:y, cost:cost, path:path});
		}

		if(canGoWest(current.x, current.y))   // Go to the West if possible
		{
			var x = current.x;
			var y = current.y;
			var cost = current.cost;
			var path = current.path;

			var prev_elevation = getElevation(x, y);
			var new_elevation = getElevation(x-1, y);

			var step_cost = get_step_cost(prev_elevation, new_elevation);
			cost += step_cost;
			path += "W";

			queue.push({x:x-1, y:y, cost:cost, path:path});
		}

		if(canGoSouth(current.x, current.y))  // Go to the South if possible
		{
			var x = current.x;
			var y = current.y;
			var cost = current.cost;
			var path = current.path;

			var prev_elevation = getElevation(x, y);
			var new_elevation = getElevation(x, y+1);

			var step_cost = get_step_cost(prev_elevation, new_elevation);
			cost += step_cost;
			path += "S";

			queue.push({x:x, y:y+1, cost:cost, path:path});
		}

		if(canGoNorth(current.x, current.y))  // Go to the North if possible
		{
			var x = current.x;
			var y = current.y;
			var cost = current.cost;
			var path = current.path;

			var prev_elevation = getElevation(x, y);
			var new_elevation = getElevation(x, y-1);

			var step_cost = get_step_cost(prev_elevation, new_elevation);
			cost += step_cost;
			path += "N";

			queue.push({x:x, y:y-1, cost:cost, path:path});
		}

	}

	var result = queue.peek(); // Get the destination information
	//console.log(result);
	return result.path;
}


// Check if you can move into East
function canGoEast(x, y)
{
	if(x + 1 > XMAX - 1)
		return false;

	if(flag[x+1][y] == "Yes")
		return false;

	return true;
}

// Check if you can move into West
function canGoWest(x, y)
{
	if(x - 1 < 0)
		return false;
	if(flag[x-1][y] == "Yes")
		return false;

	return true;
}

// Check if you can move into South
function canGoSouth(x, y)
{
	if(y + 1 > YMAX - 1)
		return false;
	if(flag[x][y+1] == "Yes")
		return false;

	return true;
}

// Check if you can move into North
function canGoNorth(x, y)
{
	if(y - 1 < 0)
		return false;
	if(flag[x][y-1] == "Yes")
		return false;

	return true;
}


// Get the cost value for each step
function get_step_cost(prev_elevation, new_elevation)
{
	var step_cost = 0;
	var delta = new_elevation - prev_elevation;
	
	if(delta < -5)
		step_cost -= delta;
	else if(delta >= -5 && delta < 0)
		step_cost = delta + 5;
	else if(delta == 0)
		step_cost = 5;
	else if(delta > 0 && delta <= 5)
		step_cost = delta + 5;
	else
		step_cost = 5 + 2 * delta;

	return step_cost;
}









//////////////////////////////////////////
// Module for test app
$("#startbtn").click(function() {
	var startx = parseInt($('#startx').val());
	var starty = parseInt($('#starty').val());
	var endx = parseInt($('#endx').val());
	var endy = parseInt($('#endy').val());
	var path = getRoute(startx, starty, endx, endy);
	$('#path').text(path);
});

function getXMAX() {
	return 6;
}
function getYMAX() {
	return 6;
}
function getElevation(x, y) {
	return parseInt($('table tr').eq( 5 - y ).find('td').eq(x).html());
}