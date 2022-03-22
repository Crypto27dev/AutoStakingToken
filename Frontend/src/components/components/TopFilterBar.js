import React, { memo, useCallback } from 'react';
import styled from "styled-components";
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { status, itemsType } from './constants/filters';
import { filterStatus, filterItemsType, filterNftTitle } from '../../store/actions';

const CustomInput = styled.input`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 9px;
  width: 100%;
`;

const TopFilterBar = () => {
    const dispatch = useDispatch();

    const handleStatus = useCallback((option) => {
        const { value } = option;
        dispatch(filterStatus({ value, singleSelect: true }));
    }, [dispatch]);

    const handleItemsType = useCallback((option) => {
        const { value } = option;
        dispatch(filterItemsType({ value, singleSelect: true }));
    }, [dispatch]);

    const filterNftTitles = useCallback((event) => {
        const value = event.target.value;
        dispatch(filterNftTitle(value));
    }, [dispatch]);

    const defaultValue = {
        value: null,
        label: 'Select Filter'
    };

    const customStyles = {
        option: (base, state) => ({
            ...base,
            color: "white",
            background: "#151B34",
            borderRadius: state.isFocused ? "0" : 0,
            "&:hover": {
                background: "#080f2a",
            }
        }),
        menu: base => ({
            ...base,
            zIndex: 9999,
            borderRadius: 0,
            marginTop: 0,
        }),
        menuList: base => ({
            ...base,
            padding: 0,
        }),
        control: (base, state) => ({
            ...base,
            color: 'white',
            background: "#151B34",
            border: '1px solid #5947FF',
            borderRadius: '10px',
            boxShadow: 'none',
            zIndex: 0,
            padding: '8px',
            "&:hover": {
                borderColor: '#5947FF',
            },
        }),
        singleValue: (base, select) => ({
            ...base,
            color: 'white'
        })
    };

    return (
        <div className="items_filter">
            <div className='row'>
                <div className='col-lg-4 col-md-6 quick_search'>
                <CustomInput
                    id="name_1"
                    name="name_1"
                    placeholder="search item here..."
                    type="text"
                    onChange={filterNftTitles}
                />
                </div>
                <div className='col-lg-4 col-md-6 dropdownSelect one'>
                <Select
                    styles={customStyles}
                    options={[defaultValue, ...status]}
                    onChange={handleStatus}
                />
                </div>
                <div className='col-lg-4 col-md-6 dropdownSelect two'>
                <Select
                    styles={customStyles}
                    options={[defaultValue, ...itemsType]}
                    onChange={handleItemsType}
                />
                </div>
            </div>
        </div>
    );
}

export default memo(TopFilterBar);