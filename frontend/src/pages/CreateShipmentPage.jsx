import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";

const CreateShipmentsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/shipments", data);
      navigate("/");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to List
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Create New Shipment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              {...register("recipient", {
                required: "Recipient name is required",
              })}
              className={`w-full p-2.5 border rounded-lg outline-none transition ${
                errors.recipient ? "border-red-500" : "focus:border-blue-500"
              }`}
            />
            {errors.recipient && (
              <span className="text-red-500 text-xs">
                {errors.recipient.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                {...register("weight")}
                className="w-full p-2.5 border rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Level
              </label>
              <select
                {...register("service")}
                className="w-full p-2.5 border rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition mt-6"
          >
            <Save size={18} /> Confirm Shipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipmentsPage;
