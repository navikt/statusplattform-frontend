import { ToastContainer } from 'react-toastify'

const toastifyMock: any = jest.createMockFromModule('react-toastify');

const ToastContainerMock = () => {
    
}

toastifyMock.ToastContainer = ToastContainerMock;

module.exports = toastifyMock

