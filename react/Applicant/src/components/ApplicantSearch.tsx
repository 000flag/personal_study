import React from 'react';
import {
    Paper,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ApplicantSearchProps {
    name: string;
    onNameChange: (v: string) => void;
    onSearch: (name: string) => void;
}

export default function ApplicantSearch({ name, onNameChange, onSearch }: ApplicantSearchProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(name.trim());
    };

    return (
        <Paper
            component="form"
            elevation={0}
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                border: '1px solid #ddd',
                borderRadius: 1,
            }}
        >
            <TextField
                fullWidth
                variant="standard"
                placeholder="이름으로 검색..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                slotProps={{
                    input: {
                        disableUnderline: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Paper>
    );
}
