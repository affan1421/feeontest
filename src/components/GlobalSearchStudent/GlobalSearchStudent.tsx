import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import styles from './GlobalSearchStudent.module.css';
import api from '@/store/api';
import { StudentModel } from '@/models/Student';
import StudentListCard from './StudentListCard/StudentListCard';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface SearchProps {
    dialog: (value: boolean) => void;
}
const GlobalSearchStudent: React.FC<SearchProps> = (props: SearchProps) => {
    const schoolId = localStorage.getItem('school_id') as string

    const searchStudentAPI = api(state => state.searchStudent);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<StudentModel[]>([]);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
    

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        debouncedHandleSearch(event.target.value)
    };

    const searchStudent = (search?: string) => {
        if (search !== '') {
            searchStudentAPI(search ? search : searchText, 1, 3, schoolId).then((response) => {
                let data = response.data.data
                setSearchResults(data)
            });
        } else {
            setSearchResults([])
        }

    };

    const debouncedHandleSearch = (searchValue: string) => {
        clearTimeout(debounceTimer!)
        const timer = setTimeout(() => {
            searchStudent(searchValue)
        }, 500)
        setDebounceTimer(timer)
    };

    useEffect(() => {
        if (searchText === '') {
            setSearchResults([]);
        }
    }, [searchText]);

    return (
        <div className={styles.main}>
            <div className={styles.searchBar}>
                <TextField
                    sx={{
                        '.MuiInputBase-input': { fontSize: '1.5rem', fontWeight: '500' },
                    }}
                    className={styles.search}
                    fullWidth
                    autoFocus
                    placeholder='Search by Student Name or Phone'
                    value={searchText}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment:
                            <div className={styles.search_icon_container}>
                                <SearchIcon fontSize='large' />
                            </div>,
                    }}
                />
            </div>
            {(searchText !== ""  && searchResults.length === 0) && (
                <div className={styles.noResults}>
                    <span>No students found.</span>
                </div>
            )}
            {searchResults.length > 0 && (
                <div className={styles.searchResults}>
                    {searchResults.map((student) => (
                        <StudentListCard student={student} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalSearchStudent;
