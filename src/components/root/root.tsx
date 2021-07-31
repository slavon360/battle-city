import React, { useState, useCallback, useEffect, useRef } from "react";

import {
	board_width,
	board_height,
	sprite_element_width,
	GRID_ELEMENTS_LEVEL1,
	SPRITES_ELEMENTS
} from '../../utils/common-data';
// import canvasContext from '../../context/canvas-context';
import Sprite from '../../utils/sprite';
import sprite_url from '../../assets/sprite.png';
// import { Gameboard } from '../gameboard/gameboard';
import './gameboard.css';

interface activeKeys {
	current: null | Set<string>
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
	// const flattened_grid_ref: any = useRef(null);
	
	const initGameboardLevels = useCallback(() => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const { image } = sprite;

		GRID_ELEMENTS_LEVEL1.forEach((row, row_index) => {
			row.forEach((cell, cell_index) => {
				const [x, y, width, height] = SPRITES_ELEMENTS[cell];
				context.drawImage(
					image,
					x, y, width, height,
					cell_index * sprite_element_width, row_index * sprite_element_width, width, height
				);
			});
		})
	}, []);

	const canNotMove = (direction: string, tank_x: number, tank_y: number ) => {
		// let cant = false;
		return GRID_ELEMENTS_LEVEL1.find((row, row_index) => {
			return row.find((cell, cell_index) => {
				const [sprite_x, sprite_y, sprite_width, sprite_height] = SPRITES_ELEMENTS[cell];
				const element_x_begin = cell_index * sprite_width;
				const element_x_end = element_x_begin + sprite_width;
				const element_y_begin = row_index * sprite_height;
				const element_y_end = element_y_begin + sprite_height;
				const tank_x_end = tank_x + sprite_element_width;
				const tank_y_end = tank_y + sprite_element_width;
				
				switch (direction) {
					case 'ArrowUp':
						if (
							cell > 0 && tank_y === element_y_end &&
							(tank_x >= element_x_begin && tank_x_end >= element_x_end &&
							tank_x - element_x_begin < sprite_element_width) ||
							cell > 0 && tank_y === element_y_end &&
							(tank_x <= element_x_begin && tank_x_end <= element_x_end &&
							element_x_end - tank_x_end < sprite_element_width) 
						) {
							console.log(tank_x, element_x_begin, tank_x_end, element_x_end);
							return true;
						}
						return false;
					case 'ArrowDown':
						if (
							cell > 0 && tank_y_end === element_y_begin &&
							(tank_x >= element_x_begin && tank_x_end >= element_x_end &&
							tank_x - element_x_begin < sprite_element_width) ||
							cell > 0 && tank_y_end === element_y_begin &&
							(tank_x <= element_x_begin && tank_x_end <= element_x_end &&
							element_x_end - tank_x_end < sprite_element_width) 
						) {
							return true;
						}
						return false;
					case 'ArrowLeft':
						if (
							cell > 0 && tank_x === element_x_end &&
							(tank_y_end >= element_y_end &&
							tank_y_end - element_y_end >= 0 && tank_y_end - element_y_end < sprite_element_width) ||
							cell > 0 && tank_x === element_x_end &&
							(tank_y_end <= element_y_end &&
							(tank_y - element_y_begin >= 0 && tank_y - element_y_begin < sprite_element_width) ||
							element_y_begin - tank_y  >= 0 && element_y_begin - tank_y < sprite_element_width)
						) {
							return true;
						}
						return false;
					case 'ArrowRight':
						if (
							cell > 0 && tank_x_end === element_x_begin &&
							(tank_y_end >= element_y_end &&
							tank_y_end - element_y_end >= 0 && tank_y_end - element_y_end < sprite_element_width) ||
							cell > 0 && tank_x_end === element_x_begin &&
							(tank_y_end <= element_y_end &&
							(tank_y - element_y_begin >= 0 && tank_y - element_y_begin < sprite_element_width) ||
							element_y_begin - tank_y  >= 0 && element_y_begin - tank_y < sprite_element_width)
						) {
							return true;
						}
						return false;

					default: return false;
				}
			});
		});
		// console.log(cant);
		// return cant;
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
		event.preventDefault();
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

					if (dead_end || canNotMove(code, tank_x, tank_y)) {
						renderTank(sprite, { tank_x, tank_y });
					}

					if (canNotMove(code, tank_x, tank_y)) {
						return {
							tank_x: tank_x,
							tank_y: tank_y
						}	
					}

					return {
						tank_x: tank_x,
						tank_y: dead_end ? 0 : tank_y - 1
					}
				});
				break;
			case 'ArrowRight':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const right_edge = board_width - sprite_element_width;
					const dead_end = tank_x >= right_edge;

					if (dead_end || canNotMove(code, tank_x, tank_y)) {
						renderTank(sprite, { tank_x, tank_y });
					}

					if (canNotMove(code, tank_x, tank_y)) {
						return {
							tank_x: tank_x,
							tank_y: tank_y
						}	
					}

					return {
						tank_x: dead_end ? right_edge : tank_x + 1,
						tank_y: tank_y
					}
				});
				break;
			case 'ArrowDown':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const right_edge = board_width - sprite_element_width;
					const dead_end = tank_y >= right_edge;

					if (dead_end || canNotMove(code, tank_x, tank_y)) {
						renderTank(sprite, { tank_x, tank_y });
					}

					if (canNotMove(code, tank_x, tank_y)) {
						return {
							tank_x: tank_x,
							tank_y: tank_y
						}	
					}

					return {
						tank_x: tank_x,
						tank_y: dead_end ? right_edge : tank_y + 1
					};
				});
				break;
			case 'ArrowLeft':
				setTankCoordinates(({ tank_x, tank_y }) => {
					const dead_end = tank_x <= 0;

					if (dead_end || canNotMove(code, tank_x, tank_y)) {
						renderTank(sprite, { tank_x, tank_y });
					}

					if (canNotMove(code, tank_x, tank_y)) {
						return {
							tank_x: tank_x,
							tank_y: tank_y
						}	
					}

					return {
						tank_x: dead_end ? 0 : tank_x - 1,
						tank_y: tank_y
					}
				});
				break;
			case 'Space':
				break;
			case 'Enter':
				break;
		}
	}, []);

	const handleKeyUpPress = useCallback(event => {
		event.preventDefault();
		const { code } = event;

		if (active_keys.current) {
			active_keys.current.delete(code);
		}

		switch (code) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
				break;
			case 'Space':
				break;
			case 'Enter':
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
				if (canNotMove(last_pushed_key, tank_x, tank_y)) {
					return {
						tank_x: tank_x,
						tank_y: tank_y
					}	
				}
				return {
					tank_x: tank_x,
					tank_y: tank_y <= 0 ? 0 : tank_y - 1
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowRight') && last_pushed_key === 'ArrowRight') {
			const right_edge = board_width - sprite_element_width;

			setTankCoordinates(({ tank_x, tank_y }) => {
				if (canNotMove(last_pushed_key, tank_x, tank_y)) {
					return {
						tank_x: tank_x,
						tank_y: tank_y
					}	
				}
				return {
					tank_x: tank_x >= right_edge ? right_edge : tank_x + 1,
					tank_y: tank_y
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowDown') && last_pushed_key === 'ArrowDown') {
			const bottom_edge = board_width - sprite_element_width;

			setTankCoordinates(({ tank_x, tank_y }) => {
				if (canNotMove(last_pushed_key, tank_x, tank_y)) {
					return {
						tank_x: tank_x,
						tank_y: tank_y
					}	
				}
				return {
					tank_x: tank_x,
					tank_y: tank_y >= bottom_edge ? bottom_edge : tank_y + 1
				}
			});
		}

		else if (active_keys.current && active_keys.current.has('ArrowLeft') && last_pushed_key === 'ArrowLeft') {
			setTankCoordinates(({ tank_x, tank_y }) => {
				if (canNotMove(last_pushed_key, tank_x, tank_y)) {
					return {
						tank_x: tank_x,
						tank_y: tank_y
					}	
				}
				return {
					tank_x: tank_x <= 0 ? 0 : tank_x - 1,
					tank_y: tank_y
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
