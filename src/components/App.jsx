import { Component } from 'react';

import { fetchImagesWithQuery } from 'services/api';

import { AppCss } from './App.styled';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { toast } from 'react-toastify';

const toastConfig = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};
export class App extends Component {
  state = {
    images: [],
    query: '',
    page: 1,
    isShowLoadMore: false,
    isShowLoader: false,
    isShowModal: false,
    largeImage: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    console.log(this.state, prevState);
    if (query !== prevState.query || page !== prevState.page) {
      try {
        this.setState({ isShowLoader: true });
        const images = await fetchImagesWithQuery(query, page);
        this.setState(
          {
            images: [...this.state.images, ...images.response],
            isShowLoadMore: true,
          },
          () => {
            if (
              Math.ceil(images.totalHits / 12) / this.state.page === 1 ||
              this.state.images.length === 0
            ) {
              this.setState({
                isShowLoadMore: false,
              });
            }
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message, toastConfig);
      } finally {
        this.setState({ isShowLoader: false });
      }
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const query = input.value.trim();
    if (query && query !== this.state.query) {
      this.setState({
        query: input.value.trim(),
        page: 1,
        images: [],
      });
    }
    input.value = '';
  };

  onClick = () => {
    this.setState({ page: this.state.page + 1 });
  };

  escListener = e =>
    e.key === 'Escape' && this.setState({ isShowModal: false, largeImage: '' });

  openModal = e => {
    const largeImage = e.target.getAttribute('data-large-image-url');
    this.setState({ isShowModal: true, largeImage });
    window.addEventListener('keydown', this.escListener);
  };

  closeModal = e => {
    if (e.target === e.currentTarget) {
      this.setState({ isShowModal: false, largeImage: '' });
      window.removeEventListener('keydown', this.escListener);
    }
  };

  render() {
    return (
      <AppCss>
        <Searchbar onSubmit={this.onSubmit} />
        <ImageGallery images={this.state.images} openModal={this.openModal} />
        {this.state.isShowLoader && <Loader />}
        {this.state.isShowLoadMore && <Button onClick={this.onClick} />}
        {this.state.isShowModal && (
          <Modal
            closeModal={this.closeModal}
            largeImage={this.state.largeImage}
          />
        )}
      </AppCss>
    );
  }
}
