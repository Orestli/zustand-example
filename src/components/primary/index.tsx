import {
  type FormikValues,
  useLogic,
  usePersonStore,
  usePersonStoreBase,
  initialFormikValues,
} from "./use-logic.ts";
import { useFormik } from "formik";

const Primary = () => {
  // const selectedUser = usePersonStoreBase((state) => state.selectedUser)
  // const isLoading = usePersonStoreBase((state) => state.isLoading)

  // Selector Retrieval Approach
  const selectedUser = usePersonStore.use.selectedUser();
  const isLoading = usePersonStore.use.isLoading();
  const firstName = usePersonStore.use.firstName();
  const lastName = usePersonStore.use.lastName();
  const updateFirstName = usePersonStore.use.updateFirstName();
  const updateLastName = usePersonStore.use.updateLastName();

  const { fetchUserById } = useLogic();

  const formik = useFormik<FormikValues>({
    initialValues: initialFormikValues,
    onSubmit: (values) => fetchUserById(values.id),
  });

  return (
    <div>
      <form className="flex gap-2" onSubmit={formik.handleSubmit}>
        <input
          className="border-[1px] border-solid border-blue-500 rounded"
          type="number"
          {...formik.getFieldProps("id")}
        />
        <button type="submit">Request</button>
      </form>
      {isLoading && <div className="text-2xl">Loading...</div>}
      {selectedUser && (
        <div className="flex flex-col gap-2">
          <span>Selected User:</span>
          <span className="p-2 bg-slate-200 rounded-md">
            {JSON.stringify(selectedUser)}
          </span>
        </div>
      )}
      <div className="mt-5 flex flex-col">
        <input
          className="border-[1px] border-solid border-blue-500 rounded"
          type="text"
          value={firstName}
          onChange={(event) => updateFirstName(event.target.value)}
        />
        <input
          className="border-[1px] border-solid border-blue-500 rounded"
          type="text"
          value={lastName}
          onChange={(event) => updateLastName(event.target.value)}
        />
        <button onClick={() => console.log(usePersonStoreBase.getState())}>
          Log State
        </button>
      </div>
    </div>
  );
};

export default Primary;
