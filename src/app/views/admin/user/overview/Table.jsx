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
        async function getNewsletter() {
            axios.get(process.env.REACT_APP_BACKEND_URI + '/user')
                .then((response) => {
                    setUser(response.data.map((u) => {
                        let date = new Date(u.lastLogin);
                        return ({
                            _id: u._id,
                            email: u.email,
                            lastLogin: u.lastLogin === undefined ? "-" : (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "." + (date.getMonth() < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1)) + "." + date.getFullYear() + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),
                            firstname: u.firstName,
                            name: u.name,
                            locked: u.locked ? "Ja" : "Nein"
                        });
                    }));
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getNewsletter()
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
            title: 'E-Mail',
        },
        {
            field: 'firstname',
            title: 'Vorname',
        },
        {
            field: 'name',
            title: 'Name'
        },
        {
            field: 'lastLogin',
            title: 'Letzter Login',
            type: 'date'
        },
        {
            field: 'locked',
            title: 'Gesperrt'
        }
    ];

    return (
        <MaterialTable
            localization={{
                pagination: {
                    labelDisplayedRows: '{from}-{to} von {count}',
                    labelRowsPerPage: 'Zeilen pro Seite',
                    labelRows: 'Zeilen',
                },
                toolbar: {
                    nRowsSelected: '{0} Zeilen ausgewählt',
                    searchPlaceholder: 'Suchen',
                    searchTooltip: 'Suche',
                },
                header: {
                    actions: ''
                },
                grouping: {
                    placeholder: 'Spalten zum Gruppieren hier ablegen'
                },
                body: {
                    emptyDataSourceMessage: 'Keine Einträge',
                    filterRow: {
                        filterTooltip: 'Filter'
                    }
                }
            }}
            components={{
                Row: (props) => {
                    return <MTableBodyRow {...props} onRowClick={onRowClicked} />;
                },
                FilterRow: (props) => {
                    return (
                        <MTableFilterRow
                            {...props}
                            localization={{
                                dateTimePickerLocalization: de,
                            }}
                        />
                    );
                },
            }}
            title={title}
            actions={[
                {
                    icon: AddIcon,
                    tooltip: "User erstellen",
                    isFreeAction: true,
                    onClick: handleCreate,
                },
            ]}
            style={{padding: '20px 24px', borderRadius: '8px'}}
            options={{
                search: true,
                filtering: true,
                selection: false,
                searchFieldStyle: {
                    marginRight: '12px',
                },
                searchFieldVariant: "outlined",
                exportMenu: [
                    {
                        label: "PDF",
                        exportFunc: (cols, datas) => ExportPdf(cols, datas, `${title}`),
                    },
                    {
                        label: "CSV",
                        exportFunc: (cols, datas) => ExportCsv(cols, datas, `${title}`),
                    }
                ],
                headerStyle: {
                    paddingRight: '8px',
                },
                pageSize: user.length < 20 ? user.length : 20,
                pageSizeOptions: [5, 10, 20, 50, { value: user.length, label: "Alle anzeigen" }]
            }}
            columns={headCells}
            data={user}/>
    );
}

export default NewsletterTable