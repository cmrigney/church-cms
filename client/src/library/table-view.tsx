import * as React from 'react';

export interface TableHeader {
    text: string|JSX.Element;
    className?: string;
    width?: number;
}

export interface TableCell {
    text: string|JSX.Element;
    className?: string;
}

export interface TableRow {
    key: string;
    className?: string;
    cells: Array<TableCell>;
}

interface TableProps {
    headers?: Array<TableHeader>;
    rows: Array<TableRow>;
    className?: string;
}

export class TableView extends React.Component<TableProps, {}> {
    constructor(props: TableProps) {
        super(props);
    }

    render() {
        return (<table className={"table " + (this.props.className || '')}>
            {
                this.props.headers &&
                (<thead><tr>
                    {this.props.headers.map(((header, index) => {
                        return (<th key={index} className={header.className} {...{width: header.width}}>{header.text}</th>);
                    }))}
                </tr></thead>)
            }
            <tbody>
                {
                    this.props.rows.map(r => {
                        return (<tr key={r.key} className={r.className}>
                            {r.cells.map((c, index) => {
                                return <td key={r.key + '-' + index} className={c.className}>{c.text}</td>;
                            })}
                        </tr>);
                    })
                }
            </tbody>
        </table>);
    }
}