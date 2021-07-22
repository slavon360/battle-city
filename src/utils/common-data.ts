export const sprite_element_width = 16;
export const OBJECT_TYPE = {
	BLANK: [336, 0, sprite_element_width, sprite_element_width],
	FORTRESS: [19 * sprite_element_width, 2 * sprite_element_width, sprite_element_width, sprite_element_width],
	BRICK: [sprite_element_width * sprite_element_width, 0, sprite_element_width, sprite_element_width]
};

export const SPRITES_ELEMENTS = [
	OBJECT_TYPE.BLANK,
	OBJECT_TYPE.FORTRESS,
	OBJECT_TYPE.BRICK
];

export const board_width = sprite_element_width * 13;
export const board_height = sprite_element_width * 13;

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const GRID_ELEMENTS_LEVEL1 = [
	[ 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0 ], 
	[ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
	[ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ]
]