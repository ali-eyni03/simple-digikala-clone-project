const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50  flex justify-center items-center">
			<div className="bg-white rounded-lg p-6 w-full max-w-md relative">
				<button
					className="absolute top-2 right-3 text-xl text-gray-500"
					onClick={onClose}
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
