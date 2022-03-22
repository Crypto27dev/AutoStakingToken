import styled from "styled-components";
import LoadingButton from '@mui/lab/LoadingButton';

export const CustomLoadingButton = styled(LoadingButton)(({ theme }) => ({
    color: 'white !important',
    background: 'linear-gradient(90deg, #7A1BFF -3.88%, #5947FF 100%) !important',
    borderRadius: '6px !important',
    border: 'none !important',
    padding: '7px 26px 7px 42px !important',
    "&:hover": {
        background: '#499ec9 !important',
    },
    '.MuiLoadingButton-loadingIndicator': {
        left: '25px !important',
        color: 'white !important'
    }
}));