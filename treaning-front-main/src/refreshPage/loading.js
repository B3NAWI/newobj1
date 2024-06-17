
import React from "react";
import ReactLoading from 'react-loading';



const Loading = () => {
	return (
		<div>
			{/* <h2>Loading in ReactJs - GeeksforGeeks</h2> */}
			{/* <ReactLoading type="balls" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="bars" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="bubbles" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="cubes" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="cylon" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="spin" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="spokes" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading
				type="spinningBubbles"
				color="#0000FF"
				height={100}
				width={50}
			/> */}
			<div class="text-center" style={{ marginTop: "250px", marginBottom: "250px", color: "rgb(25 135 84)" }}>
				<div class="spinner-border" role="status">
					<span class="visually-hidden" >Loading...</span>
				</div>
			</div>
		</div>
	);
}

const LoadingBtn = () => {
	return (
		<div>
			{/* <h2>Loading in ReactJs - GeeksforGeeks</h2> */}
			{/* <ReactLoading type="balls" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="bars" color="#0000FF"
				height={50} width={50} /> */}
			{/* <ReactLoading type="bubbles" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="cubes" color="white"
				height={40} width={100} style={{textalign:"center" ,padding:"0"}} /> */}
			{/* <ReactLoading type="cylon" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="spin" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading type="spokes" color="#0000FF"
				height={100} width={50} /> */}
			{/* <ReactLoading
				type="spinningBubbles"
				color="#0000FF"
				height={100}
				width={50}
			/> */}
			<div class="text-center" >
				<div class="spinner-border" role="status" style={{fontSize:"15px",height:"20px" , width:"20px"}}>
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	);
}


export { Loading, LoadingBtn }
