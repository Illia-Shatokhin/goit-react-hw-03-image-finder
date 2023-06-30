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
    totalLoads: 0,
    isShowLoader: false,
    isShowModal: false,
    largeImage: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page, totalLoads } = this.state;
    if (query !== prevState.query) {
      try {
        this.setState({ isShowLoader: true });
        const images = await fetchImagesWithQuery(query, page);
        this.setState({
          images: images.response,
          totalLoads: Math.ceil(images.totalHits / 12),
          isShowLoadMore: true,
        });
        images.response.length
          ? toast.success(
              `Your posts were successfully fetched! ${images.totalHits} results`,
              toastConfig
            )
          : toast.error(`Haven't images with name: ${query}!`, toastConfig);
      } catch (error) {
        console.log(error);
        toast.error(error.message, toastConfig);
      } finally {
        this.setState({ isShowLoader: false });
      }
    }
    if (page !== prevState.page && page !== 1) {
      try {
        totalLoads === page
          ? this.setState({ isShowLoadMore: false })
          : this.setState({ isShowLoader: true });
        const images = await fetchImagesWithQuery(query, page);
        this.setState({ images: [...this.state.images, ...images.response] });
        this.state.isShowLoadMore
          ? toast.info('Loaded more images', toastConfig)
          : toast.warning("That's all images", toastConfig);
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
    query &&
      this.setState({
        query: input.value.trim(),
        page: 1,
        images: [],
        totalLoads: 0,
      });
    input.value = '';
  };

  onClick = e => {
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
    window.removeEventListener('keydown', this.escListener);
    e.target.nodeName === 'DIV' &&
      this.setState({ isShowModal: false, largeImage: '' });
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
