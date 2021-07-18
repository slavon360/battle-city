import React, { useRef, useEffect, useState, useContext } from 'react';
import canvasContext from '../../context/canvas-context';
import Sprite from '../../utils/sprite';
import sprite_url from '../../assets/sprite.png';
import './gameboard.css';

interface TankCoordinates {
	tank_x: number,
	tank_y: number
}

interface Props {
	board_width: number,
	board_height: number,
	tank_coordinates: TankCoordinates
}

export const Gameboard = (props: Required<Props>) => {
	const { board_width, board_height, tank_coordinates: { tank_x, tank_y } } = props;
	const [sprite_src] = useState(sprite_url);
	const canvas_ref: any = useRef(null);

	const { _canvas, setCanvas } = useContext(canvasContext);

	useEffect(() => {
		const canvas = canvas_ref.current;
		const context = canvas.getContext('2d');
		const sprite = new Sprite(sprite_src);

		const renderTank = (context: CanvasRenderingContext2D) => {
			context.drawImage(
					sprite.image,
					0, 0, 16, 16,
					tank_x, tank_y, 16, 16
				);
		};

		sprite
			.load()
			.then((image) => {
				return renderTank(context);
			})
			.catch(error => {
				console.log(error);
			});

		if (!_canvas) {
			setCanvas(canvas);
			console.log(_canvas, canvas);
		}
	}, [sprite_src, tank_x, tank_y]);

	return (
		<canvas className="gameboard-container" ref={canvas_ref} width={board_width} height={board_height}></canvas>
	)
}