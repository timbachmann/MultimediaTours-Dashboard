import * as React from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom'
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../../../axios";
import MaterialTable, {MTableBodyRow, MTableFilterRow} from "@material-table/core";
import ExportPdf from "@material-table/exporters/pdf";
import ExportCsv from "@material-table/exporters/csv";
import {de} from "date-fns/locale";

const NewsletterTable = ({title}) => {
    let navigate = useNavigate();
    const [user, setUser] = React.useState([]);

    React.useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URI + '/users')
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);


    const handleCreate = () => {
        navigate('/admin/user/add')
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/admin/user/detail',
            search: createSearchParams({
                id: rowData._id
            }).toString()
        });
    }

    const headCells = [
        {
            field: 'email',
            title: 'Email',
        },
        {
            field: 'lastLogin',
            title: 'Last Login',
            type: 'date'
        },
        {
            field: 'role',
            title: 'Role',
            lookup: {
                ADMIN: "Admin",
                VIEW: "View"
            }
        },
    ];

    return (
        <MaterialTable
            components={{
                Row: (props) => {
                    return <MTableBodyRow {...props} onRowClick={onRowClicked} />;
                },
            }}
            title={title}
            actions={[
                {
                    icon: AddIcon,
                    tooltip: "Add User",
                    isFreeAction: true,
                    onClick: handleCreate,
                },
            ]}
            style={{padding: '20px 24px', borderRadius: '8px'}}
            options={{
                search: true,
                filtering: false,
                selection: false,
                searchFieldStyle: {
                    marginRight: '12px',
                },
                searchFieldVariant: "outlined",
                pageSizeOptions: [5, 10, 20, 50]
            }}
            columns={headCells}
            data={user}/>
    );
}

export default NewsletterTable