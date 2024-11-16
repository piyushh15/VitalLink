
const AddremovePopup = ({  onClose, onConfirm,isSubmitting, message }) => {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[28rem]">
        <div className="flex items-center mb-4">
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"fill="none"viewBox="0 0 24 24"stroke="currentColor" >
              <path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 9v4m0 4h.01"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold ml-2 text-black">Confirm Action</h2>
        </div>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-300"   disabled={isSubmitting}>
            Cancel
          </button>
          <button onClick={onConfirm}className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"   disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddremovePopup;
