import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { PageTemplate } from '../models/page-template';
import { LoadingSpinner } from '../library/loading-spinner';
import axios from 'axios';
import { TableView, TableHeader, TableRow } from '../library/table-view';

interface PageTemplatesState {
  pageTemplates: PageTemplate[]
  loading: boolean;
}

export class PageTemplates extends React.Component<RouteComponentProps<{}>, PageTemplatesState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pageTemplates: [],
      loading: true
    };

    this.fetchPageTemplates().catch(this.onError);
  }

  fetchPageTemplates = async () => {
    const result = await axios.get('/api/admin/pagetemplate');
    this.setState({
      loading: false,
      pageTemplates: result.data
    });
  }

  onError = (err: any) => {

  }

  createClicked = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    this.props.history.push('/pagetemplateeditor');
  }

  getTableHeaders(): TableHeader[] {
    return [
      {
        text: "Name"
      },
      {
        text: "Preview"
      },
      {
        text: "Action"
      }
    ];
  }

  editTemplate(id: number) {
    this.props.history.push(`/pagetemplateeditor/${id}`);
  }

  async deleteTemplate(template: PageTemplate) {
    const del = confirm(`Are you sure you want to delete ${template.name}?`);
    if(del) {
      await axios.delete(`/api/admin/pagetemplate/${template.id}`);
      this.setState({
        loading: true
      });
      await this.fetchPageTemplates().catch(this.onError);
    }
  }

  getTableRows(): TableRow[] {
    return this.state.pageTemplates.map((t): TableRow => {
      return {
        key: `${t.id}`,
        cells: [
          {
            text: t.name
          },
          {
            text: 'No Preview'
          },
          {
            text: <div>
              <button className="btn btn-primary table-button" onClick={() => this.editTemplate(t.id || 0)}><i className="fa fa-pencil"></i></button>
              <button className="btn btn-danger table-button" onClick={() => this.deleteTemplate(t)}><i className="fa fa-trash"></i></button>
            </div>
          }
        ]
      };
    });
  }

  public render() {
    return <div className="row">
      <LoadingSpinner show={this.state.loading} />
      <div className="col-12 clearfix">
        <button type="button" className="btn btn-success pull-right" onClick={this.createClicked}>Create</button>
      </div>
      { !this.state.loading && 
        <TableView headers={this.getTableHeaders()} rows={this.getTableRows()} />
      }
    </div>;
  }
}