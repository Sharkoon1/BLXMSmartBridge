export default function TxListPending({ txs }) {
	if (txs.length === 0) return null;
	return (
		<>
			{txs.map((item) => (
				<div key={item} className="alert alert-info mt-5">
					<div className="flex-1">
						<label>Transaction with ID {item.hash} is pending.</label>
					</div>
				</div>
			))}
		</>
	);
}
