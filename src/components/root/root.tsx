import React, { useState, useCallback, useEffect, useRef } from "react";

import {
	board_width,
	board_height,
	sprite_element_width,
	GRID_ELEMENTS_LEVEL1,
	TYPES
	// SPRITES_ELEMENTS
} from '../../utils/common-data';
// import canvasContext from '../../context/canvas-context';
import Sprite from '../../utils/sprite';
import sprite_url from '../../assets/sprite.png';
// import { Gameboard } from '../gameboard/gameboard';
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

interface imgCoordinatesRef {
	current: imgCoordinates
}

interface stepAxis {
	step_x: number,
	step_y: number
}

interface stepAxisRef {
	current: stepAxis
}

const sprite = new Sprite(sprite_url);

export const Root = () => {
	const [tank_coordinates, setTankCoordinates] = useState({ tank_x: 0, tank_y: 60 });
	const { tank_x, tank_y } = tank_coordinates;
	const active_keys: activeKeys = useRef(null);
	const current_animation_frame: any = useRef(null);
	const canvas_ref: any = useRef(null);
	const tank_img_coordinates_ref: imgCoordinatesRef = useRef({ img_x: 0, img_y: 0 });
	const step_axis_ref: stepAxisRef = useRef({ step_x: 0, step_y: 0 });
	const is_debug_ref: debug = useRef(false);
	// const flattened_grid_ref: any = useRef(null);
	
	const initGameboardLevels = useCallback(() => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const { image } = sprite;

		GRID_ELEMENTS_LEVEL1.forEach((row, row_index) => {
			row.forEach((cell, cell_index) => {
				const {
					sprite_x,
					sprite_y,
					sprite_width,
					sprite_height
				} = cell.type;
				context.drawImage(
					image,
					sprite_x, sprite_y, sprite_width, sprite_height,
					cell_index * sprite_element_width, row_index * sprite_element_width, sprite_width, sprite_height
				);
			});
		})
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
				const { sprite_width, sprite_height, type_name } = cell.type;
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
						} else if (is_tank_opposite_to_object_at_y_axis(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width)) {
							adjusted_value = adjusted_value || handle_tank_axis_adjustment(tank_x, tank_x_end, element_x_begin, element_x_end, sprite_element_width);

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

	const handleTankImgCoordinates = (key: string) => {
		switch (key) {
			case 'ArrowUp':
				tank_img_coordinates_ref.current = {
					img_x: 0 * sprite_element_width,
					img_y: 0
				};
				break;
			case 'ArrowRight':
				tank_img_coordinates_ref.current = {
					img_x: 6 * sprite_element_width,
					img_y: 0
				};
				break;
			case 'ArrowDown':
				tank_img_coordinates_ref.current = {
					img_x: 4 * sprite_element_width,
					img_y: 0
				};
				break;
			case 'ArrowLeft':
				tank_img_coordinates_ref.current = {
					img_x: 2 * sprite_element_width,
					img_y: 0
				};
				break;
		
			default:
				tank_img_coordinates_ref.current = {
					img_x: 0 * sprite_element_width,
					img_y: 0
				};
				break;
		}
	}

	const handleKeyDownPress = useCallback(event => {
		const { code } = event;

		if (active_keys.current) {
			active_keys.current.add(code);
		} else {
			active_keys.current = new Set();
			active_keys.current.add(code);
		}
		handleTankImgCoordinates(code);
		switch (code) {
			case 'ArrowUp':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const dead_end = tank_y <= 0;
					const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

					if (dead_end || cant_move) {
						renderTank(sprite, { tank_x, tank_y });
						return {
							tank_x: tank_x + adjusted_value,
							tank_y: tank_y
						}	
					}

					return {
						tank_x: tank_x + adjusted_value,
						tank_y: dead_end ? 0 : tank_y - 1
					}
				});
				event.preventDefault();
				break;
			case 'ArrowRight':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const right_edge = board_width - sprite_element_width;
					const dead_end = tank_x >= right_edge;
					const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

					if (dead_end || cant_move) {
						renderTank(sprite, { tank_x, tank_y });

						return {
							tank_x: tank_x,
							tank_y: tank_y + adjusted_value
						}
					}

					// if (canNotMove(code, tank_x, tank_y)) {
					// 	return {
					// 		tank_x: tank_x,
					// 		tank_y: tank_y
					// 	}
					// }

					return {
						tank_x: dead_end ? right_edge : tank_x + 1,
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

					if (dead_end || cant_move) {
						renderTank(sprite, { tank_x, tank_y });

						return {
							tank_x: tank_x + adjusted_value,
							tank_y: tank_y
						}
					}

					// if (canNotMove(code, tank_x, tank_y)) {
					// 	return {
					// 		tank_x: tank_x,
					// 		tank_y: tank_y
					// 	}
					// }

					return {
						tank_x: tank_x + adjusted_value,
						tank_y: dead_end ? right_edge : tank_y + 1
					};
				});
				event.preventDefault();
				break;
			case 'ArrowLeft':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const dead_end = tank_x <= 0;
					const { cant_move, adjusted_value } = canNotMove(code, tank_x, tank_y);

					if (dead_end || cant_move) {
						renderTank(sprite, { tank_x, tank_y });

						return {
							tank_x: tank_x,
							tank_y: tank_y + adjusted_value
						}
					}

					// if (canNotMove(code, tank_x, tank_y)) {
					// 	return {
					// 		tank_x: tank_x,
					// 		tank_y: tank_y
					// 	}
					// }

					return {
						tank_x: dead_end ? 0 : tank_x - 1,
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
		handleTankImgCoordinates(last_pushed_key);

		if (active_keys.current && active_keys.current.has('ArrowUp') && last_pushed_key === 'ArrowUp') {
			setTankCoordinates(({ tank_x, tank_y }) => {
				const { cant_move, adjusted_value } = canNotMove(last_pushed_key, tank_x, tank_y);

				if (cant_move) {
					return {
						tank_x: tank_x + adjusted_value,
						tank_y: tank_y
					}	
				}

				return {
					tank_x: tank_x + adjusted_value,
					tank_y: tank_y <= 0 ? 0 : tank_y - 1
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
				return {
					tank_x: tank_x >= right_edge ? right_edge : tank_x + 1,
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
				return {
					tank_x: tank_x + adjusted_value,
					tank_y: tank_y >= bottom_edge ? bottom_edge : tank_y + 1
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
				return {
					tank_x: tank_x <= 0 ? 0 : tank_x - 1,
					tank_y: tank_y + adjusted_value
				}
			});
		}

		current_animation_frame.current = requestAnimationFrame(loop);
	};

	const clearScreen = () => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');

		if (context) {
			context.clearRect(0, 0, board_width, board_height);
		}
	};

	const renderTank = useCallback((
		sprite,
		tank_coordinates
	) => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const { image } = sprite;
		let { tank_x, tank_y } = tank_coordinates;
		const { img_x, img_y } = tank_img_coordinates_ref.current;
		const { step_x } = step_axis_ref.current;

		context.drawImage(
				image,
				img_x + sprite_element_width * step_x, img_y, sprite_element_width, sprite_element_width,
				tank_x, tank_y, sprite_element_width, sprite_element_width
			);
	}, []);

	useEffect(() => {
		if (sprite.image.complete && sprite.image.naturalHeight !== 0) {
			initGameboardLevels();
			renderTank(sprite, { tank_x, tank_y });
		}
	}, [tank_x, tank_y]);

	useEffect(() => {
		sprite
			.load()
			.then((image) => {
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
