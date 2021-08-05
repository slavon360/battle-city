export const sprite_element_width = 16;
export const TYPES = {
	BLANK: 'BLANK',
	FORTRESS: 'FORTRESS',
	BRICK: 'BRICK'
};
export const OBJECT_TYPE = {
	BLANK: {
		sprite_x: 336,
		sprite_y: 0,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.BLANK
	},
	FORTRESS: {
		sprite_x: 19 * sprite_element_width,
		sprite_y: 2 * sprite_element_width,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.FORTRESS
	},
	BRICK: {
		sprite_x: sprite_element_width * sprite_element_width,
		sprite_y: 0,
		sprite_width: sprite_element_width,
		sprite_height: sprite_element_width,
		type_name: TYPES.BRICK
	}
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

const DAMAGE_LEVEL = {
	INTACT: 'INTACT',
	TOP1X: 'TOP1X',
	TOP2X: 'TOP2X',
	TOP3X: 'TOP3X',
	BOTTOM1X: 'BOTTOM1X',
	BOTTOM2X: 'BOTTOM2X',
	BOTTOM3X: 'BOTTOM3X',
	LEFT1X: 'LEFT1X',
	LEFT2X: 'LEFT2X',
	LEFT3X: 'LEFT3X',
	RIGHT1X: 'RIGHT1X',
	RIGHT2X: 'RIGHT2X',
	RIGHT3X: 'RIGHT3X',
	TOP_LEFT1X: 'TOP_LEFT1X',
	TOP_LEFT2X: 'TOP_LEFT2X',
	TOP_LEFT3X: 'TOP_LEFT3X',
	TOP_RIGHT1X: 'TOP_RIGHT1X',
	TOP_RIGHT2X: 'TOP_RIGHT2X',
	TOP_RIGHT3X: 'TOP_RIGHT3X',
	BOTTOM_LEFT1X: 'BOTTOM_LEFT1X',
	BOTTOM_LEFT2X: 'BOTTOM_LEFT2X',
	BOTTOM_LEFT3X: 'BOTTOM_LEFT3X',
	BOTTOM_RIGHT1X: 'BOTTOM_RIGHT1X',
	BOTTOM_RIGHT2X: 'BOTTOM_RIGHT2X',
	BOTTOM_RIGHT3X: 'BOTTOM_RIGHT3X',
	LEFT_TOP1X: 'LEFT_TOP1X',
	LEFT_TOP2X: 'LEFT_TOP2X',
	LEFT_TOP3X: 'LEFT_TOP3X',
	LEFT_BOTTOM1X: 'LEFT_BOTTOM1X',
	LEFT_BOTTOM2X: 'LEFT_BOTTOM2X',
	LEFT_BOTTOM3X: 'LEFT_BOTTOM3X',
	RIGHT_TOP1X: 'RIGHT_TOP1X',
	RIGHT_TOP2X: 'RIGHT_TOP2X',
	RIGHT_TOP3X: 'RIGHT_TOP3X',
	RIGHT_BOTTOM1X: 'RIGHT_BOTTOM1X',
	RIGHT_BOTTOM2X: 'RIGHT_BOTTOM2X',
	RIGHT_BOTTOM3X: 'RIGHT_BOTTOM3X'
}

export const GRID_ELEMENTS_LEVEL1 = [
	[ 
		{
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[ 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	], 
	[
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	], 
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}, 
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		}, 
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		}, 
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		}, 
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.BRICK,
			damage: DAMAGE_LEVEL.INTACT
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	],
	[
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{ 
			type: OBJECT_TYPE.FORTRESS,
			damage: DAMAGE_LEVEL.INTACT
		},
		{ 
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		},
		{
			type: OBJECT_TYPE.BLANK
		}
	]
]