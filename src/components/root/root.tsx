import React, { useState, useCallback, useEffect, useRef } from "react";

import { board_width, board_height, sprite_element_width } from '../../utils/common-data';
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
	const [tank_coordinates, setTankCoordinates] = useState({ tank_x: 50, tank_y: 60 });
	const { tank_x, tank_y } = tank_coordinates;
	const active_keys: activeKeys = useRef(null);
	const current_animation_frame: any = useRef(null);
	const canvas_ref: any = useRef(null);
	const img_coordinates_ref: imgCoordinatesRef = useRef({ img_x: 0, img_y: 0 });
	const step_axis_ref: stepAxisRef = useRef({ step_x: 0, step_y: 0 });
	// const { _canvas } = useContext(canvasContext);
	
	const handleKeyDownPress = useCallback(event => {
		event.preventDefault();
		const { code } = event;

		if (active_keys.current) {
			active_keys.current.add(code);
		} else {
			active_keys.current = new Set();
			active_keys.current.add(code);
		}
		switch (code) {
			case 'ArrowUp':
				img_coordinates_ref.current = {
					img_x: 0 * sprite_element_width,
					img_y: 0
				};

				setTankCoordinates(({ tank_x, tank_y }) => ({
					tank_x: tank_x,
					tank_y: tank_y - 1
				}));
				break;
			case 'ArrowRight':
				img_coordinates_ref.current = {
					img_x: 6 * sprite_element_width,
					img_y: 0
				};

				setTankCoordinates(({ tank_x, tank_y }) => ({
					tank_x: tank_x + 1,
					tank_y: tank_y
				}));
				break;
			case 'ArrowDown':
				img_coordinates_ref.current = {
					img_x: 4 * sprite_element_width,
					img_y: 0
				};
				setTankCoordinates(({ tank_x, tank_y }) => ({
					tank_x: tank_x,
					tank_y: tank_y + 1
				}));
				break;
			case 'ArrowLeft':
				img_coordinates_ref.current = {
					img_x: 2 * sprite_element_width,
					img_y: 0
				};
				setTankCoordinates(({ tank_x, tank_y }) => ({
					tank_x: tank_x - 1,
					tank_y: tank_y
				}));
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
		if (active_keys.current && active_keys.current.has('ArrowUp')) {
			setTankCoordinates(({ tank_x, tank_y }) => ({
				tank_x: tank_x,
				tank_y: tank_y - 1
			}));
		}

		if (active_keys.current && active_keys.current.has('ArrowDown')) {
			setTankCoordinates(({ tank_x, tank_y }) => ({
				tank_x: tank_x,
				tank_y: tank_y + 1
			}));
		}

		if (active_keys.current && active_keys.current.has('ArrowLeft')) {
			setTankCoordinates(({ tank_x, tank_y }) => ({
				tank_x: tank_x - 1,
				tank_y: tank_y
			}));
		}

		if (active_keys.current && active_keys.current.has('ArrowRight')) {
			setTankCoordinates(({ tank_x, tank_y }) => ({
				tank_x: tank_x + 1,
				tank_y: tank_y
			}));
		}
		
		// console.log(active_keys.current);
		current_animation_frame.current = requestAnimationFrame(loop);
	};

	const clearScreen = (context: CanvasRenderingContext2D) => {
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
		const { tank_x, tank_y } = tank_coordinates;
		const { img_x, img_y } = img_coordinates_ref.current;
		const { step_x } = step_axis_ref.current;

		console.log(img_x, img_y);
		console.log(tank_x, tank_y);
		console.log(step_x);
		clearScreen(context);
		context.drawImage(
				image,
				img_x + sprite_element_width * step_x, img_y, sprite_element_width, sprite_element_width,
				tank_x, tank_y, sprite_element_width, sprite_element_width
			);
	}, []);

	useEffect(() => {
		if (sprite.image.complete && sprite.image.naturalHeight !== 0) {
			return renderTank(sprite, { tank_x, tank_y });
		}
	}, [tank_x, tank_y]);

	useEffect(() => {
		sprite
			.load()
			.then((image) => {
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
