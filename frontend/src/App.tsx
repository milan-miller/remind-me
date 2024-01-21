import { useState } from 'react';
import './App.css';

function App() {
	const [clickCount, setClickCount] = useState(0);

	return (
		<div className='App'>
			<p>Count: {clickCount}</p>
			<button
				disabled={clickCount === 10}
				onClick={() => setClickCount(clickCount + 1)}
			>
				+
			</button>
			<button
				disabled={clickCount === 0}
				onClick={() => setClickCount(clickCount - 1)}
			>
				-
			</button>
		</div>
	);
}

export default App;
