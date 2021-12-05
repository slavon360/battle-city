import React, { useState, useCallback, useEffect, useRef } from "react";

import {
	board_width,
	board_height,
	sprite_element_width,
	GRID_ELEMENTS_LEVEL1,
	TYPES,
	DAMAGE_LEVEL,
	KEYBOARD_KEYS_DIRECTIONS,
	KEYBOARD_KEY_SPACE,
	FULL_STATE_VALUE
	// SPRITES_ELEMENTS
} from '../../utils/common-data';
// import canvasContext from '../../context/canvas-context';
import Sprite from '../../utils/sprite';
// import sprite_url from '../../assets/sprite.png';
import './gameboard.css';

interface activeKeys {
	current: null | Set<string>
}

interface debug {
	current: boolean
}

interface debugCoordinates {
	x_begin: number,
	width: number,
	y_begin: number,
	height: number
}

interface imgCoordinates {
	img_x: number,
	img_y: number
}

interface tankDirectionRef {
	current: string | null
}

interface stepAxis {
	step_x: number,
	step_y: number
}

interface stepAxisRef {
	current: stepAxis
}

interface tankSpeedRef {
	current: number
}

interface tankLevelRef {
	current: number
}

const sprite = new Sprite();

export const Root = () => {
	const [tank_coordinates, setTankCoordinates] = useState({ tank_x: 0, tank_y: 60 });
	const { tank_x, tank_y } = tank_coordinates;
	const active_keys: activeKeys = useRef(null);
	const current_animation_frame: any = useRef(null);
	const canvas_ref: any = useRef(null);
	const tank_direction_ref: tankDirectionRef = useRef(null);
	const step_axis_ref: stepAxisRef = useRef({ step_x: 0, step_y: 0 });
	const is_debug_ref: debug = useRef(false);
	const tank_speed_ref: tankSpeedRef = useRef(2);
	const tank_level_ref: tankLevelRef = useRef(1);
	// const flattened_grid_ref: any = useRef(null);
	
	const initGameboardLevels = useCallback(() => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const { images } = sprite;

		GRID_ELEMENTS_LEVEL1.forEach((row, row_index) => {
			row.forEach((cell, cell_index) => {
				const {
					element_pos_x,
					element_pos_y,
					sprite_width,
					sprite_height,
					type_name
				} = cell;

				if (row_index === 0 && cell_index === 6) {
					cell.setDamageLevel(DAMAGE_LEVEL.TOP3X);
					cell.setDamageLevel(DAMAGE_LEVEL.BOTTOM_RIGHT2X);
				}

				if (type_name !== TYPES.BLANK) {
					context.drawImage(
						images[type_name],
						element_pos_x, element_pos_y
					);
				}

				if (cell.state < FULL_STATE_VALUE) {
					context.beginPath();
					// context.moveTo(element_pos_x, element_pos_y);
					cell.damage_coordinates.forEach((val, index, coords) => {
						if (index % 4 === 0) {
							context.moveTo(...val);
						}

						
						context.lineTo(...val);
						// if (!(index % 2) && index) {
						// 	const coord_x = coords[index - 1] || 0;
						// 	const coord_y = coords[index] || 0;
						// 	console.log(coord_x, coord_y);
						// 	context.lineTo(cell_x + coord_x, element_pos_y + coord_y);
						// }

						if (coords.length === index + 1) {
							// context.fillStyle = 'blue';
							context.fill();
						}
					})
				}
			});
		});
	}, []);

	const is_tank_on_the_same_axis_level_with_object = (type_name: string, tank_axis: number, element_axis: number) => {
		return type_name !== TYPES.BLANK && tank_axis === element_axis;
	}
	const is_tank_opposite_to_object_at_y_axis = (
			tank_axis_begin: number,
			tank_axis_end: number,
			element_axis_begin: number,
			element_axis_end: number,
			sprite_element_width: number
		) => {
		return (tank_axis_begin >= element_axis_begin && tank_axis_end >= element_axis_end &&
			tank_axis_begin - element_axis_begin < sprite_element_width) ||
			(tank_axis_begin <= element_axis_begin && tank_axis_end <= element_axis_end &&
			element_axis_end - tank_axis_end < sprite_element_width);
	}

	const is_tank_opposite_to_object_at_x_axis = (
		tank_axis_begin: number,
		tank_axis_end: number,
		element_axis_begin: number,
		element_axis_end: number,
		sprite_element_width: number
	) => {
		return (tank_axis_end >= element_axis_end &&
			tank_axis_end - element_axis_end >= 0 && tank_axis_end - element_axis_end < sprite_element_width) ||
			(tank_axis_end <= element_axis_end &&
			(tank_axis_begin - element_axis_begin >= 0 && tank_axis_begin - element_axis_begin < sprite_element_width) ||
			element_axis_begin - tank_axis_begin  >= 0 && element_axis_begin - tank_axis_begin < sprite_element_width);
	}

	const handle_tank_axis_adjustment = (
		tank_axis_begin: number,
		tank_axis_end: number,
		element_axis_begin: number,
		element_axis_end: number,
		sprite_element_width: number
	) => {
		const difference1 = element_axis_end - tank_axis_begin;
		const difference2 = tank_axis_end - element_axis_begin;
		const should_adjust = (difference1 <= sprite_element_width / 5) || (difference2 <= sprite_element_width / 5);
		const adjusted_value = difference1 > difference2 ? -difference2 : difference1;

		return should_adjust ? adjusted_value : 0;
	}

	const debugHandler = (coordinates: debugCoordinates) => {
		const {
			x_begin,
			width,
			y_begin,
			height
		} = coordinates;
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');

		context.strokeStyle = '#ffffff';
		context.lineWidth = 1;
		context.strokeRect(x_begin, y_begin, width, height);
	};

	const canNotMove = (direction: string, tank_x: number, tank_y: number ) => {
		let adjusted_value = 0;

		const cant_move = GRID_ELEMENTS_LEVEL1.find((row, row_index) => {
			return row.find((cell, cell_index) => {
				const { sprite_width, sprite_height, type_name } = cell;
				const element_x_begin = cell_index * sprite_width;
				const element_x_end = element_x_begin + sprite_width;
				const element_y_begin = row_index * sprite_height;
				const element_y_end = element_y_begin + sprite_height;
				const tank_x_end = tank_x + sprite_element_width;
				const tank_y_end = tank_y + sprite_element_width;
				
				switch (direction) {
					case 'ArrowUp':
						if (
							is_tank_on_the_same_axis_level_with_object(type_name, tank_y, element_y_end) &&
							is_tank_opposite_to_object_at_y_axis(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width)
						) {
							if (is_debug_ref.current) {
								debugHandler({
									x_begin: element_x_begin,
									width: sprite_width,
									y_begin: element_y_begin,
									height: sprite_height
								});
							}
							adjusted_value = handle_tank_axis_adjustment(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width);

							return true;
						} else if (
							is_tank_opposite_to_object_at_y_axis(
								tank_x,
								tank_x_end,
								element_x_begin,
								element_x_end,
								sprite_element_width
							)
						) {
							adjusted_value = adjusted_value || handle_tank_axis_adjustment(
								tank_x,
								tank_x_end,
								element_x_begin,
								element_x_end,
								sprite_element_width
							);

							return false;
						}
						return false;
					case 'ArrowDown':
						if (
							is_tank_on_the_same_axis_level_with_object(type_name, tank_y_end, element_y_begin) &&
							is_tank_opposite_to_object_at_y_axis(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width)
						) {
							if (is_debug_ref.current) {
								debugHandler({
									x_begin: element_x_begin,
									width: sprite_width,
									y_begin: element_y_begin,
									height: sprite_height
								});
							}
							adjusted_value = handle_tank_axis_adjustment(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width);

							return true;
						} else if (is_tank_opposite_to_object_at_y_axis(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width)) {
							adjusted_value = adjusted_value || handle_tank_axis_adjustment(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width);

							return false;
						}
						return false;
					case 'ArrowLeft':
						if (
							is_tank_on_the_same_axis_level_with_object(type_name, tank_x, element_x_end) &&
							is_tank_opposite_to_object_at_x_axis(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width)
						) {
							if (is_debug_ref.current) {
								debugHandler({
									x_begin: element_x_begin,
									width: sprite_width,
									y_begin: element_y_begin,
									height: sprite_height
								});
							}
							adjusted_value = handle_tank_axis_adjustment(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width);

							return true;
						} else if (is_tank_opposite_to_object_at_x_axis(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width)) {
							adjusted_value = adjusted_value || handle_tank_axis_adjustment(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width);

							return false;
						}
						return false;
					case 'ArrowRight':
						if (
							is_tank_on_the_same_axis_level_with_object(type_name, tank_x_end, element_x_begin) &&
							is_tank_opposite_to_object_at_x_axis(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width)
						) {
							if (is_debug_ref.current) {
								debugHandler({
									x_begin: element_x_begin,
									width: sprite_width,
									y_begin: element_y_begin,
									height: sprite_height
								});
							}
							adjusted_value = handle_tank_axis_adjustment(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width);

							return true;
						} else if (is_tank_opposite_to_object_at_x_axis(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width)) {
							adjusted_value = adjusted_value || handle_tank_axis_adjustment(tank_y, tank_y_end, element_y_begin, element_y_end, sprite_element_width);

							return false;
						}
						return false;

					default: return false;
				}
			});
		});

		return { cant_move, adjusted_value };
	}

	const handleTankDirection = (key: string) => {
		switch (key) {
			case 'ArrowUp':
				tank_direction_ref.current = 'up';
				break;
			case 'ArrowRight':
				tank_direction_ref.current = 'right';
				break;
			case 'ArrowDown':
				tank_direction_ref.current = 'down';
				break;
			case 'ArrowLeft':
				tank_direction_ref.current = 'left';
				break;
		
			default:
				tank_direction_ref.current = 'up';
				break;
		}
	}

	const handleKeyDownPress = useCallback(event => {
		const { code } = event;

		if (KEYBOARD_KEYS_DIRECTIONS.includes(code)) {
			if (active_keys.current) {
				active_keys.current.add(code);
			} else {
				active_keys.current = new Set();
				active_keys.current.add(code);
			}
			handleTankDirection(code);
			switch (code) {
				case 'ArrowUp':
					setTankCoordinates(({ tank_x, tank_y }) => {
						const dead_end = tank_y <= 0;
						const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

						clearScreen(tank_x, tank_y, sprite_element_width, sprite_element_width);
	
						if (dead_end || cant_move) {
							renderTank(sprite, { tank_x, tank_y });
							return {
								tank_x: tank_x + adjusted_value,
								tank_y: tank_y
							}	
						}

						if (adjusted_value) {
							const point_x = adjusted_value < 0 ? (tank_x + sprite_element_width + adjusted_value) : tank_x;

							// clearScreen(point_x, tank_y, Math.abs(adjusted_value), sprite_element_width);
						}
						
						// clearScreen(tank_x, tank_y + sprite_element_width - 2, sprite_element_width, tank_speed_ref.current);
						return {
							tank_x: tank_x + adjusted_value,
							tank_y: dead_end ? 0 : tank_y - tank_speed_ref.current
						}
					});
					event.preventDefault();
					break;
				case 'ArrowRight':
					setTankCoordinates(({ tank_x, tank_y }) => {
						const right_edge = board_width - sprite_element_width;
						const dead_end = tank_x >= right_edge;
						const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

						clearScreen(tank_x, tank_y, sprite_element_width, sprite_element_width);
	
						if (dead_end || cant_move) {
							renderTank(sprite, { tank_x, tank_y });
	
							return {
								tank_x: tank_x,
								tank_y: tank_y + adjusted_value
							}
						}

						if (adjusted_value) {
							const point_y = adjusted_value < 0 ? (tank_y + sprite_element_width + adjusted_value) : tank_y;

							// clearScreen(tank_x, point_y, sprite_element_width, Math.abs(adjusted_value));
						}
	
						// clearScreen(tank_x - 1, tank_y, tank_speed_ref.current, sprite_element_width);
						return {
							tank_x: dead_end ? right_edge : tank_x + tank_speed_ref.current,
							tank_y: tank_y + adjusted_value
						}
					});
					event.preventDefault();
					break;
				case 'ArrowDown':
					setTankCoordinates(({ tank_x, tank_y }) => {
						const right_edge = board_width - sprite_element_width;
						const dead_end = tank_y >= right_edge;
						const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

						clearScreen(tank_x, tank_y, sprite_element_width, sprite_element_width);
	
						if (dead_end || cant_move) {
							renderTank(sprite, { tank_x, tank_y });
	
							return {
								tank_x: tank_x + adjusted_value,
								tank_y: tank_y
							}
						}

						if (adjusted_value) {
							const point_x = adjusted_value < 0 ? (tank_x + sprite_element_width + adjusted_value) : tank_x;

							// clearScreen(point_x, tank_y, Math.abs(adjusted_value), sprite_element_width);
						}
	
						// clearScreen(tank_x, tank_y - 1, sprite_element_width, tank_speed_ref.current);
						return {
							tank_x: tank_x + adjusted_value,
							tank_y: dead_end ? right_edge : tank_y + tank_speed_ref.current
						};
					});
					event.preventDefault();
					break;
				case 'ArrowLeft':
					setTankCoordinates(({ tank_x, tank_y }) => {
						const dead_end = tank_x <= 0;
						const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

						clearScreen(tank_x, tank_y, sprite_element_width, sprite_element_width);
	
						if (dead_end || cant_move) {
							renderTank(sprite, { tank_x, tank_y });
	
							return {
								tank_x: tank_x,
								tank_y: tank_y + adjusted_value
							}
						}

						if (adjusted_value) {
							const point_y = adjusted_value < 0 ? (tank_y + sprite_element_width + adjusted_value) : tank_y;

							// clearScreen(tank_x, point_y, sprite_element_width, Math.abs(adjusted_value));
						}
	
						// clearScreen(tank_x, tank_y, sprite_element_width + tank_speed_ref.current, sprite_element_width);
						return {
							tank_x: dead_end ? 0 : tank_x - tank_speed_ref.current,
							tank_y: tank_y + adjusted_value
						}
					});
					event.preventDefault();
					break;
				case 'Space':
					event.preventDefault();
					break;
				case 'Enter':
					event.preventDefault();
					break;
			}
		} else if (KEYBOARD_KEY_SPACE === code) {
			event.preventDefault();
		}
	}, []);

	const handleKeyUpPress = useCallback(event => {
		const { code } = event;

		if (active_keys.current) {
			active_keys.current.delete(code);
		}

		switch (code) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'Space':
			case 'Enter':
				event.preventDefault();
				break;
		}
	}, []);

	const loop = () => {
		step_axis_ref.current = {
			step_x: step_axis_ref.current.step_x ^ 1,
			step_y: 0
		}
		const last_pushed_key = active_keys.current && Array.from(active_keys.current).pop() || '';
		handleTankDirection(last_pushed_key);

		if (active_keys.current && active_keys.current.has('ArrowUp') && last_pushed_key === 'ArrowUp') {
			setTankCoordinates(({ tank_x, tank_y }) => {
				const { cant_move, adjusted_value } = canNotMove(last_pushed_key, tank_x, tank_y);

				if (cant_move) {
					return {
						tank_x: tank_x + adjusted_value,
						tank_y: tank_y
					}	
				}

				// if (adjusted_value) {
					// debugHandler({
					// 	x_begin: tank_x,
					// 	width: Math.abs(adjusted_value),
					// 	y_begin: tank_y,
					// 	height: sprite_element_width
					// });
					// const point_x = adjusted_value < 0 ? tank_x + adjusted_value : tank_x;

					// clearScreen(point_x, tank_y, Math.abs(adjusted_value), sprite_element_width);
				// }
				// clearScreen(tank_x, tank_y + sprite_element_width - 2, sprite_element_width, tank_speed_ref.current);
				return {
					tank_x: tank_x + adjusted_value,
					tank_y: tank_y <= 0 ? 0 : tank_y - tank_speed_ref.current
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowRight') && last_pushed_key === 'ArrowRight') {
			const right_edge = board_width - sprite_element_width;

			setTankCoordinates(({ tank_x, tank_y }) => {
				const { cant_move, adjusted_value } = canNotMove(last_pushed_key, tank_x, tank_y);

				if (cant_move) {
					return {
						tank_x: tank_x,
						tank_y: tank_y + adjusted_value
					}	
				}

				// clearScreen(tank_x - 1, tank_y, tank_speed_ref.current, sprite_element_width);
				return {
					tank_x: tank_x >= right_edge ? right_edge : tank_x + tank_speed_ref.current,
					tank_y: tank_y + adjusted_value
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowDown') && last_pushed_key === 'ArrowDown') {
			const bottom_edge = board_width - sprite_element_width;

			setTankCoordinates(({ tank_x, tank_y }) => {
				const { cant_move, adjusted_value } = canNotMove(last_pushed_key, tank_x, tank_y);

				if (cant_move) {
					return {
						tank_x: tank_x + adjusted_value,
						tank_y: tank_y
					}	
				}
				// clearScreen(tank_x, tank_y - 1, sprite_element_width, tank_speed_ref.current);
				return {
					tank_x: tank_x + adjusted_value,
					tank_y: tank_y >= bottom_edge ? bottom_edge : tank_y + tank_speed_ref.current
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowLeft') && last_pushed_key === 'ArrowLeft') {
			setTankCoordinates(({ tank_x, tank_y }) => {
				const { cant_move, adjusted_value } = canNotMove(last_pushed_key, tank_x, tank_y);

				if (cant_move) {
					return {
						tank_x: tank_x,
						tank_y: tank_y + adjusted_value
					}	
				}

				// clearScreen(tank_x + sprite_element_width, tank_y, tank_speed_ref.current, sprite_element_width);
				return {
					tank_x: tank_x <= 0 ? 0 : tank_x - tank_speed_ref.current,
					tank_y: tank_y + adjusted_value
				}
			});
		}

		current_animation_frame.current = requestAnimationFrame(loop);
	};

	const clearScreen = (x: number, y: number, width: number, height: number) => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');

		if (context) {
			context.clearRect(x, y, width, height);
		}
	};

	const renderTank = useCallback((
		sprite,
		tank_coordinates
	) => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const { images } = sprite;
		const { tank_x, tank_y } = tank_coordinates;
		const direction = tank_direction_ref.current;
		const { step_x } = step_axis_ref.current;
		const level = tank_level_ref.current;
		const level_val = level > 1 ? '_s' + level : '';
		const tank_image_name = `tank_player1_${direction}_c0_t${step_x ? 2 : 1}${level_val}`;

		context.drawImage(
				images[tank_image_name],
				tank_x, tank_y
			);
	}, []);

	useEffect(() => {
		if (sprite.loaded) {
			clearScreen(0, 0, board_width, board_height);
			initGameboardLevels();
			renderTank(sprite, { tank_x, tank_y });
		}
	}, [tank_x, tank_y]);

	useEffect(() => {
		sprite
			.load()
			.then((res) => {
				initGameboardLevels();

				return renderTank(sprite, tank_coordinates);
			})
			.catch(error => {
				console.log(error);
			});
	}, []);
	// useEffect(() => {
	// 	renderTank(sprite, tank_coordinates);
	// }, [tank_x, tank_y]);

	useEffect(() => {
		current_animation_frame.current = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(current_animation_frame.current);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDownPress);

		return () => {
			document.removeEventListener('keydown', handleKeyDownPress);
		};
	}, [handleKeyDownPress]);

	useEffect(() => {
		document.addEventListener('keyup', handleKeyUpPress);

		return () => {
			document.removeEventListener('keyup', handleKeyUpPress);
		};
	}, [handleKeyUpPress]);

	return (
		<canvas className="gameboard-container" ref={canvas_ref} width={board_width} height={board_height}></canvas>
	)
};
