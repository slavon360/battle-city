export const sprite_element_width = 32;
export const sprite_element_height = 32;
export const FULL_STATE_VALUE = 8;
export const BULLETS_WIDTH = 8;
export const BULLETS_HEIGHT = 8;
export const KEYBOARD_KEYS_DIRECTIONS = [ 'ArrowUp', 'ArrowRight', 'ArrowDown',	'ArrowLeft' ];
export const DIRECTIONS = {
	UP: 'up',
	RIGHT: 'right',
	DOWN: 'down',
	LEFT: 'left'
};
export const KEYBOARD_KEY_SPACE = 'Space';
export const TYPES = {
	BLANK: 'BLANK',
	FORTRESS: 'base',
	BRICK: 'wall_brick'
};
export const OBJECT_TYPE = {
	BLANK: {
		sprite_x: 10 * sprite_element_width,
		sprite_y: 8 * sprite_element_width + sprite_element_width / 2,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.BLANK
	},
	FORTRESS: {
		sprite_x: 11 * sprite_element_width,
		sprite_y: 7 * sprite_element_width + sprite_element_width / 2,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.FORTRESS
	},
	BRICK: {
		sprite_x: 8 * sprite_element_width,
		sprite_y: 5 * sprite_element_width + sprite_element_width / 2,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.BRICK
	}
};

interface destroyedElement {
	sprite_x: number,
	sprite_y: number,
	sprite_width: number,
	sprite_height: number,
	begin_x: number,
	begin_y: number
}

interface damageData {
	title: string,
	coords: (number | undefined)[]
}

class GridElement {
	element_pos_x: number;
	element_pos_y: number;
	sprite_width: number;
	sprite_height: number;
	damages: (string | undefined)[];
	state: number;
	_damage_coordinates: Array<number[]>
	type_name: string

	constructor(
		element_pos_x: number,
		element_pos_y: number,
		sprite_width: number,
		sprite_height: number,
		damage: string,
		type_name: string
	) {
		this.element_pos_x = element_pos_x;
		this.element_pos_y = element_pos_y;
		this.sprite_width = sprite_width;
		this.sprite_height = sprite_height;
		this.damages = [];
		this.state = FULL_STATE_VALUE;
		this._damage_coordinates = [];
		this.type_name = type_name;
	}

	get damage_coordinates() {
		return this._damage_coordinates; 
	}

	getDamageCoordinates() {
		return this._damage_coordinates;
	}

	generateDamageCoordinates(damage_level: string) {
		return DAMAGE_LEVEL_COORDINATES[damage_level] ? DAMAGE_LEVEL_COORDINATES[damage_level].map(([x, y]) => ([
			this.element_pos_x + x, this.element_pos_y + y
		])) : [];
	}

	getDamageNameOnVerticalDirection(bullet_coordinates: number[], from_bottom: boolean) {
		const [ bullet_x, bullet_y ] = bullet_coordinates;
		const adjusted_bullet_x = bullet_x - this.element_pos_x;
		const adjusted_bullet_y = bullet_y - this.element_pos_y;
		const damage_data = Object.entries(DAMAGE_LEVEL_COORDINATES).find(([damage_name, coordinates]) => {
			const [ [x1, y1], [x2, y2], [x3, y3], [x4, y4] ] = coordinates;
				
			const bullet_is_on_x_axis_left_side = (adjusted_bullet_x + BULLETS_WIDTH > x1 && adjusted_bullet_x <= x2 &&
				adjusted_bullet_x <= sprite_element_width / 3 && x2 === sprite_element_width / 2 && x1 === 0) ||
				(adjusted_bullet_x <= x3 && adjusted_bullet_x <= sprite_element_width / 3 &&
				x3 === sprite_element_width / 2 && x4 === 0 && adjusted_bullet_x + BULLETS_WIDTH > x4);

			const bullet_is_on_x_axis_right_side = (adjusted_bullet_x >= x1 && adjusted_bullet_x < x2 &&
				adjusted_bullet_x <= sprite_element_width && adjusted_bullet_x > sprite_element_width /2 &&
				x2 === sprite_element_width && x1 === sprite_element_width / 2) ||
				(adjusted_bullet_x >= x4 && adjusted_bullet_x < x3 && adjusted_bullet_x <= sprite_element_width &&
					adjusted_bullet_x > sprite_element_width /2 && x3 === sprite_element_width && x4 === sprite_element_width / 2);

			const bullet_is_on_x_axis_center_side = (x1 === 0 && x2 === sprite_element_width &&
				adjusted_bullet_x === (sprite_element_width / 2 - BULLETS_WIDTH / 2)) ||
			(x3 === sprite_element_width && x4 === 0 && adjusted_bullet_x >= x4 &&
				adjusted_bullet_x === (sprite_element_width / 2 - BULLETS_WIDTH / 2) &&
				adjusted_bullet_x <= Math.floor(sprite_element_width / 1.3));

			const bullet_is_on_y_axis = from_bottom ? (adjusted_bullet_y < y1 || adjusted_bullet_y < y4) 
				: (adjusted_bullet_y > y1 && adjusted_bullet_y < y4);

			return (bullet_is_on_x_axis_left_side || bullet_is_on_x_axis_right_side || bullet_is_on_x_axis_center_side)
			&& bullet_is_on_y_axis;			
		});

		// console.log(damage_data, this);
		const [ damage_name = '' ] = damage_data || [];
		// console.log('adjusted_bullet_y: ', adjusted_bullet_y);
		// console.log('bullet_y: ', bullet_y);
		return damage_name;
	}

	setDamageLevel(damage_name: string) {
		const TOP = 'TOP';
		const BOTTOM = 'BOTTOM';
		const RIGHT = 'RIGHT';
		const LEFT = 'LEFT';
		let damage_names = ['INTACT'];

		switch (true) {
			case !damage_name.includes('_') && damage_name.includes(TOP):
				damage_names = [
					damage_name.replace(TOP, `${TOP}_${RIGHT}`),
					damage_name.replace(TOP, `${TOP}_${LEFT}`)
				]
				break;
			case !damage_name.includes('_') && damage_name.includes(BOTTOM):
				damage_names = [
					damage_name.replace(BOTTOM, `${BOTTOM}_${RIGHT}`),
					damage_name.replace(BOTTOM, `${BOTTOM}_${LEFT}`)
				]
				break;
			case !damage_name.includes('_') && damage_name.includes(RIGHT):
				damage_names = [
					damage_name.replace(RIGHT, `${RIGHT}_${TOP}`),
					damage_name.replace(RIGHT, `${RIGHT}_${BOTTOM}`)
				]
				break;
			case !damage_name.includes('_') && damage_name.includes(LEFT):
				damage_names = [
					damage_name.replace(LEFT, `${LEFT}_${TOP}`),
					damage_name.replace(LEFT, `${LEFT}_${BOTTOM}`)
				]
				break;
			// case damage_name.includes('_'):
			// 	damage_names = [ damage_name.replace('_', `_${TOP}`) ]
			// 	break;
			default: damage_names = [];
				break;
		}

		this.state =  this.updateDamages(damage_name);

		damage_names.forEach(damage_name => this.updateDamages(damage_name));

		return this.state;
	}

	updateDamages(damage: string) {	
		let state = this.state;

		if (!this.damages.includes(damage) && damage) {
			this.damages = [ ...this.damages, damage ];
			this._damage_coordinates= [
				...this._damage_coordinates,
				...this.generateDamageCoordinates(damage)
			];
			switch (damage) {
				case DAMAGE_LEVEL.LEFT1X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.LEFT_TOP1X) && !this.damages.includes(DAMAGE_LEVEL.LEFT_BOTTOM1X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.LEFT2X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.LEFT_TOP2X) && !this.damages.includes(DAMAGE_LEVEL.LEFT_BOTTOM2X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.LEFT3X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.LEFT_TOP3X) && !this.damages.includes(DAMAGE_LEVEL.LEFT_BOTTOM3X)
					? 2 : 1;

				case DAMAGE_LEVEL.LEFT4X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.LEFT_TOP4X) && !this.damages.includes(DAMAGE_LEVEL.LEFT_BOTTOM4X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.RIGHT1X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.RIGHT_TOP1X) && !this.damages.includes(DAMAGE_LEVEL.RIGHT_BOTTOM1X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.RIGHT2X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.RIGHT_TOP2X) && !this.damages.includes(DAMAGE_LEVEL.RIGHT_BOTTOM2X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.RIGHT3X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.RIGHT_TOP3X) && !this.damages.includes(DAMAGE_LEVEL.RIGHT_BOTTOM3X)
					? 2 : 1;

				case DAMAGE_LEVEL.RIGHT4X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.RIGHT_TOP4X) && !this.damages.includes(DAMAGE_LEVEL.RIGHT_BOTTOM4X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.TOP1X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.TOP_LEFT1X) && !this.damages.includes(DAMAGE_LEVEL.TOP_RIGHT1X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.TOP2X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.TOP_LEFT2X) && !this.damages.includes(DAMAGE_LEVEL.TOP_RIGHT2X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.TOP3X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.TOP_LEFT3X) && !this.damages.includes(DAMAGE_LEVEL.TOP_RIGHT3X)
					? 2 : 1;

				case DAMAGE_LEVEL.TOP4X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.TOP_LEFT4X) && !this.damages.includes(DAMAGE_LEVEL.TOP_RIGHT4X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.BOTTOM1X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.BOTTOM_LEFT1X) && !this.damages.includes(DAMAGE_LEVEL.BOTTOM_RIGHT1X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.BOTTOM2X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.BOTTOM_LEFT2X) && !this.damages.includes(DAMAGE_LEVEL.BOTTOM_RIGHT2X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.BOTTOM3X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.BOTTOM_LEFT3X) && !this.damages.includes(DAMAGE_LEVEL.BOTTOM_RIGHT3X)
					? 2 : 1;

				case DAMAGE_LEVEL.BOTTOM4X:
					return state -= !this.damages.includes(DAMAGE_LEVEL.BOTTOM_LEFT4X) && !this.damages.includes(DAMAGE_LEVEL.BOTTOM_RIGHT4X)
					? 2 : 1;
					
				case DAMAGE_LEVEL.TOP_LEFT1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_LEFT2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_LEFT3X:
					return state -= 1;
				
				case DAMAGE_LEVEL.TOP_LEFT4X: 
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_RIGHT1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_RIGHT2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_RIGHT3X:
					return state -= 1;
					
				case DAMAGE_LEVEL.TOP_RIGHT4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_LEFT1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_LEFT2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_LEFT3X:
					return state -= 1;

				case DAMAGE_LEVEL.BOTTOM_LEFT4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_RIGHT1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_RIGHT2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.BOTTOM_RIGHT3X:
					return state -= 1;

				case DAMAGE_LEVEL.BOTTOM_RIGHT4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_TOP1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_TOP2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_TOP3X:
					return state -= 1;

				case DAMAGE_LEVEL.LEFT_TOP4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_BOTTOM1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_BOTTOM2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_BOTTOM3X:
					return state -= 1;
					
				case DAMAGE_LEVEL.LEFT_BOTTOM4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_TOP1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_TOP2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_TOP3X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_TOP4X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_BOTTOM1X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_BOTTOM2X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_BOTTOM3X:
					return state -= 1;
					
				case DAMAGE_LEVEL.RIGHT_BOTTOM4X:
					return state -= 1;
					
				default: return state;
			}
		}

		return state;
	}
}

export const SPRITES_ELEMENTS = [
	OBJECT_TYPE.BLANK,
	OBJECT_TYPE.FORTRESS,
	OBJECT_TYPE.BRICK
];

export const board_width = sprite_element_width * 13;
export const board_height = sprite_element_width * 13;

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const DAMAGE_LEVEL = {
	INTACT: 'INTACT',
	TOP1X: 'TOP1X',
	TOP2X: 'TOP2X',
	TOP3X: 'TOP3X',
	TOP4X: 'TOP4X',
	BOTTOM1X: 'BOTTOM1X',
	BOTTOM2X: 'BOTTOM2X',
	BOTTOM3X: 'BOTTOM3X',
	BOTTOM4X: 'BOTTOM4X',
	LEFT1X: 'LEFT1X',
	LEFT2X: 'LEFT2X',
	LEFT3X: 'LEFT3X',
	LEFT4X: 'LEFT4X',
	RIGHT1X: 'RIGHT1X',
	RIGHT2X: 'RIGHT2X',
	RIGHT3X: 'RIGHT3X',
	RIGHT4X: 'RIGHT4X',
	TOP_LEFT1X: 'TOP_LEFT1X',
	TOP_LEFT2X: 'TOP_LEFT2X',
	TOP_LEFT3X: 'TOP_LEFT3X',
	TOP_LEFT4X: 'TOP_LEFT4X',
	TOP_RIGHT1X: 'TOP_RIGHT1X',
	TOP_RIGHT2X: 'TOP_RIGHT2X',
	TOP_RIGHT3X: 'TOP_RIGHT3X',
	TOP_RIGHT4X: 'TOP_RIGHT4X',
	BOTTOM_LEFT1X: 'BOTTOM_LEFT1X',
	BOTTOM_LEFT2X: 'BOTTOM_LEFT2X',
	BOTTOM_LEFT3X: 'BOTTOM_LEFT3X',
	BOTTOM_LEFT4X: 'BOTTOM_LEFT4X',
	BOTTOM_RIGHT1X: 'BOTTOM_RIGHT1X',
	BOTTOM_RIGHT2X: 'BOTTOM_RIGHT2X',
	BOTTOM_RIGHT3X: 'BOTTOM_RIGHT3X',
	BOTTOM_RIGHT4X: 'BOTTOM_RIGHT4X',
	LEFT_TOP1X: 'LEFT_TOP1X',
	LEFT_TOP2X: 'LEFT_TOP2X',
	LEFT_TOP3X: 'LEFT_TOP3X',
	LEFT_TOP4X: 'LEFT_TOP4X',
	LEFT_BOTTOM1X: 'LEFT_BOTTOM1X',
	LEFT_BOTTOM2X: 'LEFT_BOTTOM2X',
	LEFT_BOTTOM3X: 'LEFT_BOTTOM3X',
	LEFT_BOTTOM4X: 'LEFT_BOTTOM4X',
	RIGHT_TOP1X: 'RIGHT_TOP1X',
	RIGHT_TOP2X: 'RIGHT_TOP2X',
	RIGHT_TOP3X: 'RIGHT_TOP3X',
	RIGHT_TOP4X: 'RIGHT_TOP4X',
	RIGHT_BOTTOM1X: 'RIGHT_BOTTOM1X',
	RIGHT_BOTTOM2X: 'RIGHT_BOTTOM2X',
	RIGHT_BOTTOM3X: 'RIGHT_BOTTOM3X',
	RIGHT_BOTTOM4X: 'RIGHT_BOTTOM4X'
}

export const DAMAGE_LEVEL_COORDINATES = {
	[DAMAGE_LEVEL.TOP1X]: [
		[0, 0],
		[sprite_element_width, 0],
		[sprite_element_width, sprite_element_height / 4],
		[0, sprite_element_height / 4]
	],
	[DAMAGE_LEVEL.TOP2X]: [
		[0, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 2],
		[0, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.TOP3X]: [
		[0, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[0, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.TOP4X]: [
		[0, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, sprite_element_height],
		[0, sprite_element_height]
	],
	[DAMAGE_LEVEL.BOTTOM1X]: [
		[0, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, sprite_element_height],
		[0, sprite_element_height]
	],
	[DAMAGE_LEVEL.BOTTOM2X]: [
		[0, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[0, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.BOTTOM3X]: [
		[0, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 2],
		[0, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.BOTTOM4X]: [
		[0, 0],
		[sprite_element_width, 0],
		[sprite_element_width, sprite_element_height / 4],
		[0, sprite_element_height / 4]
	],
	// [DAMAGE_LEVEL.LEFT1X]: [
	// 	[0, 0],
	// 	[sprite_element_width / 4, 0],
	// 	[sprite_element_width / 4, sprite_element_height],
	// 	[0, sprite_element_height]
	// ],
	// [DAMAGE_LEVEL.LEFT2X]: [
	// 	[0, 0],
	// 	[sprite_element_width / 2, 0],
	// 	[sprite_element_width / 2, sprite_element_height],
	// 	[0, sprite_element_height]
	// ],
	// [DAMAGE_LEVEL.LEFT3X]: [
	// 	[0, 0],
	// 	[Math.floor(sprite_element_width / 1.3), 0],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height],
	// 	[0, sprite_element_height]
	// ],
	// [DAMAGE_LEVEL.LEFT4X]: [
	// 	[0, 0],
	// 	[sprite_element_width, 0],
	// 	[sprite_element_width, sprite_element_height],
	// 	[0, sprite_element_height]
	// ],
	[DAMAGE_LEVEL.RIGHT1X]: [
		[sprite_element_width, 0],
		[sprite_element_width / 4, 0],
		[sprite_element_width / 4, sprite_element_height],
		[sprite_element_width, sprite_element_height]
	],
	[DAMAGE_LEVEL.RIGHT2X]: [
		[sprite_element_width, 0],
		[sprite_element_width / 2, 0],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width, sprite_element_height]
	],
	[DAMAGE_LEVEL.RIGHT3X]: [
		[sprite_element_width, 0],
		[Math.floor(sprite_element_width / 1.3), 0],
		[Math.floor(sprite_element_width / 1.3), sprite_element_height],
		[sprite_element_width, sprite_element_height]
	],
	// [DAMAGE_LEVEL.RIGHT4X]: [
	// 	[sprite_element_width, 0],
	// 	[sprite_element_width, 0],
	// 	[sprite_element_width, sprite_element_height],
	// 	[sprite_element_width, sprite_element_height]
	// ],
	[DAMAGE_LEVEL.TOP_LEFT1X]: [
		[0, 0],
		[sprite_element_width / 2, 0],
		[sprite_element_width / 2, sprite_element_height / 4],
		[0, sprite_element_height / 4]
	],
	[DAMAGE_LEVEL.TOP_LEFT2X]: [
		[0, sprite_element_height / 4],
		[sprite_element_width / 2, sprite_element_height / 4],
		[sprite_element_width / 2, sprite_element_height / 2],
		[0, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.TOP_LEFT3X]: [
		[0, sprite_element_height / 2],
		[sprite_element_width / 2, sprite_element_height / 2],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[0, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.TOP_LEFT4X]: [
		[0, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width / 2, sprite_element_height],
		[0, sprite_element_height]
	],
	[DAMAGE_LEVEL.TOP_RIGHT1X]: [
		[sprite_element_width / 2, 0],
		[sprite_element_width, 0],
		[sprite_element_width, sprite_element_height / 4],
		[sprite_element_width / 2, sprite_element_height / 4]
	],
	[DAMAGE_LEVEL.TOP_RIGHT2X]: [
		[sprite_element_width / 2, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width / 2, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.TOP_RIGHT3X]: [
		[sprite_element_width / 2, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.TOP_RIGHT4X]: [
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height]
	],
	[DAMAGE_LEVEL.BOTTOM_LEFT1X]: [
		[0, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[0, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.BOTTOM_LEFT2X]: [
		[0, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width / 2, sprite_element_height / 2],
		[0, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.BOTTOM_LEFT3X]: [
		[0, sprite_element_height / 2],
		[sprite_element_width / 2, sprite_element_height / 2],
		[sprite_element_width / 2, sprite_element_height / 4],
		[0, sprite_element_height / 4]
	],
	[DAMAGE_LEVEL.BOTTOM_LEFT4X]: [
		[0, sprite_element_height / 4],
		[sprite_element_width / 2, sprite_element_height / 4],
		[sprite_element_width / 2, 0],
		[0, 0]
	],
	[DAMAGE_LEVEL.BOTTOM_RIGHT1X]: [
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width / 2, Math.floor(sprite_element_height / 1.3)],
		[sprite_element_width, Math.floor(sprite_element_height / 1.3)]
	],
	[DAMAGE_LEVEL.BOTTOM_RIGHT2X]: [
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.BOTTOM_RIGHT3X]: [
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height / 4],
		[sprite_element_width, sprite_element_height / 4]
	],
	// [DAMAGE_LEVEL.BOTTOM_RIGHT4X]: [
	// 	[sprite_element_width, sprite_element_height],
	// 	[sprite_element_width / 2, sprite_element_height],
	// 	[sprite_element_width / 2, 0],
	// 	[sprite_element_width, 0]
	// ],
	// [DAMAGE_LEVEL.LEFT_TOP1X]: [
	// 	[0, 0],
	// 	[0, sprite_element_height / 2],
	// 	[sprite_element_width / 4, sprite_element_height / 2],
	// 	[sprite_element_width / 4, 0]
	// ],
	// [DAMAGE_LEVEL.LEFT_TOP2X]: [
	// 	[0, 0],
	// 	[0, sprite_element_height / 2],
	// 	[sprite_element_width / 2, sprite_element_height / 2],
	// 	[sprite_element_width / 2, 0]
	// ],
	// [DAMAGE_LEVEL.LEFT_TOP3X]: [
	// 	[0, 0],
	// 	[0, sprite_element_height / 2],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height / 2],
	// 	[Math.floor(sprite_element_width / 1.3), 0]
	// ],
	// [DAMAGE_LEVEL.LEFT_TOP4X]: [
	// 	[0, 0],
	// 	[0, sprite_element_height / 2],
	// 	[sprite_element_width, sprite_element_height / 2],
	// 	[sprite_element_width, 0]
	// ],
	// [DAMAGE_LEVEL.LEFT_BOTTOM1X]: [
	// 	[0, sprite_element_height / 2],
	// 	[0, sprite_element_height],
	// 	[sprite_element_width / 4, sprite_element_height],
	// 	[sprite_element_width / 4, sprite_element_height / 2]
	// ],
	// [DAMAGE_LEVEL.LEFT_BOTTOM2X]: [
	// 	[0, sprite_element_height / 2],
	// 	[0, sprite_element_height],
	// 	[sprite_element_width / 2, sprite_element_height],
	// 	[sprite_element_width / 2, sprite_element_height / 2]
	// ],
	// [DAMAGE_LEVEL.LEFT_BOTTOM3X]: [
	// 	[0, sprite_element_height / 2],
	// 	[0, sprite_element_height],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height / 2]
	// ],
	// [DAMAGE_LEVEL.LEFT_BOTTOM4X]: [
	// 	[0, sprite_element_height / 2],
	// 	[0, sprite_element_height],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height],
	// 	[Math.floor(sprite_element_width / 1.3), sprite_element_height / 2]
	// ],
	[DAMAGE_LEVEL.RIGHT_TOP1X]: [
		[sprite_element_width, 0],
		[Math.floor(sprite_element_width / 1.3), 0],
		[Math.floor(sprite_element_width / 1.3), sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.RIGHT_TOP2X]: [
		[sprite_element_width, 0],
		[sprite_element_width / 2, 0],
		[sprite_element_width / 2, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.RIGHT_TOP3X]: [
		[sprite_element_width, 0],
		[sprite_element_width / 4, 0],
		[sprite_element_width / 4, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height / 2]
	],
	// [DAMAGE_LEVEL.RIGHT_TOP4X]: [
	// 	[sprite_element_width, 0],
	// 	[0, 0],
	// 	[0, sprite_element_height / 2],
	// 	[sprite_element_width, sprite_element_height / 2]
	// ],
	[DAMAGE_LEVEL.RIGHT_BOTTOM1X]: [
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height],
		[Math.floor(sprite_element_width / 1.3), sprite_element_height],
		[Math.floor(sprite_element_width / 1.3), sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.RIGHT_BOTTOM2X]: [
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height],
		[sprite_element_width / 2, sprite_element_height / 2]
	],
	[DAMAGE_LEVEL.RIGHT_BOTTOM3X]: [
		[sprite_element_width, sprite_element_height / 2],
		[sprite_element_width, sprite_element_height],
		[sprite_element_width / 4, sprite_element_height],
		[sprite_element_width / 4, sprite_element_height / 2]
	],
	// [DAMAGE_LEVEL.RIGHT_BOTTOM4X]: [
	// 	[sprite_element_width, sprite_element_height / 2],
	// 	[sprite_element_width, sprite_element_height],
	// 	[0, sprite_element_height],
	// 	[0, sprite_element_height / 2]
	// ]
}

export const GRID_ELEMENTS_LEVEL1 = [
	[
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BRICK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	],
	[
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.FORTRESS,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK,
		TYPES.BLANK
	]
].map((row, row_index) => {
	return row.map((cell, cell_index) => {
		const element_pos_x = cell_index * sprite_element_width;
		const element_pos_y = row_index * sprite_element_width;
		switch (cell) {
			case TYPES.BLANK:
				return new GridElement(
					element_pos_x,
					element_pos_y,
					sprite_element_width,
					sprite_element_width,
					DAMAGE_LEVEL.INTACT,
					TYPES.BLANK
				);
		
			case TYPES.BRICK:
				return new GridElement(
					element_pos_x,
					element_pos_y,
					sprite_element_width,
					sprite_element_width,
					DAMAGE_LEVEL.INTACT,
					TYPES.BRICK
				);

			case TYPES.FORTRESS:
				return new GridElement(
					element_pos_x,
					element_pos_y,
					sprite_element_width,
					sprite_element_width,
					DAMAGE_LEVEL.INTACT,
					TYPES.FORTRESS
				);

			default: return new GridElement(
				element_pos_x,
				element_pos_y,
				sprite_element_width,
				sprite_element_width,
				DAMAGE_LEVEL.INTACT,
				TYPES.BLANK
			);
		}
	});
});