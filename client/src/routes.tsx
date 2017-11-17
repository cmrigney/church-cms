import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { PageTemplates } from './components/PageTemplates';
import { Pages } from './components/Pages';
import { PageTemplateEditor } from './components/PageTemplateEditor';
import { PageEditor } from './components/PageEditor';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/pagetemplates' component={ PageTemplates } />
    <Route path='/pages' component={ Pages } />
    <Route path='/pagetemplateeditor/:id?' component={ PageTemplateEditor } />
    <Route path='/pageeditor/:id?' component={ PageEditor } />
</Layout>;