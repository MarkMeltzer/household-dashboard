/**
 * Returns a copy of an object with a value changed.
 * 
 * @param {object} object the object to return a changed copy of
 * @param {string} key the key of the attribute to change
 * @param {any} value the value to change the attribute to
 * @returns 
 */
 export function updateObject(object, key, value) {
	return {...object, [key]:value};
}

/**
 * Returns a copy of an object with an item removed.
 * 
 * @param {object} object the object to return a changed copy of
 * @param {string} key the key of the attribute to remove
 * @returns 
 */
 export function removeItemFromObject(object, key) {
	const objectDuplicate = Object.assign({}, object);
	delete objectDuplicate[key]

	return objectDuplicate;
}

/**
 * Returns a copy of a list with an item changed.
 * 
 * @param {object} list the list to return a changed copy of
 * @param {string} index the index of the item to change
 * @param {string} value the value to change the item to
 * @returns 
 */
 export function updateArray(array, index, value) {
	const arrayCopy = array.slice();
	arrayCopy[index] = value;
	return arrayCopy;
}

export function swapArrayElements(array, index1, index2) {
	const arrayCopy = array.slice();
	arrayCopy[index1] = array[index2];
	arrayCopy[index2] = array[index1];
	return arrayCopy;
}

export function removeItemFromArray(array, index) {
	return array.filter((el, i) => index !== i);
}

export function DebugRenderObject(objectToRender) {
	return <div style={{textAlign: 'left'}}>
		<pre>
			{JSON.stringify(objectToRender.objectToRender, null, 4)}
		</pre>
	</div>
}
