import * as React from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom'
import axios from "../../../../axios";
import MaterialTable, {MTableBodyRow, MTableFilterRow} from "@material-table/core";
import EditIcon from "@mui/icons-material/Edit";
import ExportPdf from "@material-table/exporters/pdf";
import ExportCsv from "@material-table/exporters/csv";
import {de} from "date-fns/locale";

const ParticipantsTable = ({title, bookings, campID, campName}) => {
    let navigate = useNavigate();
    const [bookingData, setBookingData] = React.useState([]);

    const handleAddParticipant = () => {
        navigate({
            pathname: '/camps/addParticipant',
            search: createSearchParams({
                id: campID
            }).toString()
        });
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/persons/detail',
            search: createSearchParams({
                id: rowData._id
            }).toString()
        });
    }


    React.useEffect(() => {
        const promises = [];
        for (const booking of bookings) {
            promises.push(axios.get(process.env.REACT_APP_BACKEND_URI + `/person/${booking.person_id}`))
        }
        Promise.all(promises)
            .then(function (values) {

                setBookingData(bookings.map((b) => {
                    let data = values.map((response) => response.data);
                    let person = JSON.parse(JSON.stringify(data)).find((p) => p._id === b.person_id);
                    return ({
                        _id: person._id,
                        name: person.name,
                        firstName: person.firstName,
                        birthday: person.birthday,
                        isMember: person.member !== undefined,
                        participationDays: b.participation_days,
                        halfDay: b.half_day,
                        lunch: b.lunch,
                        price: b.price,
                    });
                }));
            });
    }, [bookings]);

    const headCells = [
        {
            field: 'name',
            title: 'Name',
            defaultSort: 'asc'
        },
        {
            field: 'firstName',
            title: 'Vorname',
        },
        {
            field: 'birthday',
            type: 'date',
            title: 'Jahrgang',
        },
        {
            field: 'isMember',
            title: 'Mitglied',
            lookup: {
                true: "Ja",
                false: "Nein",
            },
        },
        {
            field: 'participationDays',
            type: 'numeric',
            title: 'Tage',
            lookup: bookingData.reduce((obj, item) => ({...obj, [item['participationDays']]:item.participationDays}), {})
        },
        {
            field: 'halfDay',
            title: 'Halbtags',
            lookup: {
                true: "Ja",
                false: "Nein",
            },
        },
        {
            field: 'lunch',
            title: 'Mittagessen',
            lookup: {
                true: "Ja",
                false: "Nein",
            },
        },
        {
            field: 'price',
            type: 'numeric',
            title: 'Preis',
        },
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
                    icon: EditIcon,
                    tooltip: "Teilnehmer bearbeiten",
                    isFreeAction: true,
                    onClick: handleAddParticipant,
                },
            ]}
            style={{padding: '20px 24px', borderRadius: '8px'}}
            options={{
                search: true,
                filtering: true,
                grouping: true,
                searchFieldStyle: {
                    marginRight: '12px',
                },
                searchFieldVariant: "outlined",
                exportMenu: [
                    {
                        label: "PDF",
                        exportFunc: (cols, datas) => ExportPdf(cols, datas.map((row) => {
                            row.birthday = new Date(row.birthday).toLocaleDateString();
                            return row;
                        }), `${campName} - ${title}`),
                    },
                    {
                        label: "CSV",
                        exportFunc: (cols, datas) => ExportCsv(cols, datas.map((row) => {
                            row.birthday = new Date(row.birthday).toLocaleDateString();
                            return row;
                        }), `${campName} - ${title}`),
                    }
                ],
                headerStyle: {
                    paddingRight: '8px',
                },
                pageSizeOptions: [5, 10, 20, 50, { value: bookingData.length, label: "Alle anzeigen" }]
            }}
            columns={headCells}
            data={bookingData}/>
    );
}

export default ParticipantsTable