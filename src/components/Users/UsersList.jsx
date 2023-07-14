import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { DataTable, Avatar, Button } from "@shopify/polaris";
import { getAllUsers } from "@/redux/slices/userSlice";
import { getAccountData } from "@/redux/slices/accountSlice";
import { removeUser } from "@/redux/slices/userSlice";
import PaginationComponent from '@/components/PaginationComponent';
import { EditUserForm } from './EditUserForm';
import { DeleteModal } from '../Modals/DeleteModal';


export const UserList = () => {
  const users = useSelector(getAllUsers);
  console.log(users);
  const account = useSelector(getAccountData);
  const dispatch = useDispatch();


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const handleDeleteUser = (userId) => {
    dispatch(removeUser(userId));
  };

  const handlePageChange = useCallback((selectedPage) => {
    setCurrentPage(selectedPage);
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const rows = paginatedUsers.map((user) => {
    const editBtn = {
      url: `/editprofile/${user.id}`,
      primary: true,
      disabled: account.role !== "admin",
    };

    const deleteBtn = {
      destructive: true,
      disabled: account.role !== "admin",
      onClick: () => handleDeleteUser(user.id),
    };

    return [

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <Avatar
            customer
            size="medium"
            name={user.name}
            source={user.avatarSource}
          />
          {user.name}
        </div>
        {
          account.role === 'admin' &&
          <div style={{ display: "flex", gap: "10px" }}>
            <EditUserForm id={user.id} />
            <DeleteModal/>
          </div>
        }

      </div>,
    ];
  });

  const totalItems = users.length;

  return (
    <>
      <DataTable
        columnContentTypes={['', 'text', 'text', 'text']}
        headings={['Users']}
        rows={rows}
        footerContent={totalItems > itemsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', }}>
            <PaginationComponent
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      />

    </>
  );
};