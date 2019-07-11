import React, { Component } from 'react';
import {
  FaGithubAlt,
  FaPlus,
  FaSpinner,
  FaRedoAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error: false });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === '') throw 'Você precisar escrever o nome do repositório';

      const hasRepo = repositories.find(r => r.name === newRepo);

      if (hasRepo) throw 'repositório duplicado';

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleRefresh = e => {
    this.setState({ loading: false, error: false, newRepo: '' });
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <Container>
        <div>
          <h1>
            <FaGithubAlt />
            Repositórios
          </h1>

          <FaRedoAlt
            size={18}
            color={'#7159c1'}
            onClick={this.handleRefresh}
            className="refresh"
          />
        </div>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <div>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  Detalhes
                </Link>
                <a href="">
                  <FaTrashAlt />
                </a>
              </div>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
