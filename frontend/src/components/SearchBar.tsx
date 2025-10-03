import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%'
}));

const SuggestionsDropdown = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: theme.spacing(1),
  maxHeight: 400,
  overflowY: 'auto',
  zIndex: 1300,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
}));

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

// Mock data for suggestions
const popularSearches = [
  'Dior Bag',
  'Women Dress',
  'Men Suit',
  'Sunglasses',
  'Shoes',
  'Accessories'
];

const productSuggestions = [
  'Lady Dior Bag',
  'Dior Bar Jacket',
  'Miss Dior Dress',
  'Dior Homme Suit',
  'Dior B27 Sneakers',
  'Dior Sunglasses',
  'Dior Saddle Bag',
  'Dior Book Tote'
];

export function SearchBar({ onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = productSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      saveToHistory(searchTerm);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      onSearch?.(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <SearchContainer ref={containerRef}>
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search products..."
        size="medium"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '28px',
            backgroundColor: 'background.paper',
            height: 52,
            '& input': { fontSize: '1rem' }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="medium" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {showSuggestions && (
        <SuggestionsDropdown>
          {/* Search Suggestions */}
          {filteredSuggestions.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SUGGESTIONS
                </Typography>
              </Box>
              <List dense>
                {filteredSuggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleSuggestionClick(suggestion)}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SearchIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          )}

          {/* Search History */}
          {!searchQuery && searchHistory.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  RECENT SEARCHES
                </Typography>
                <Typography 
                  variant="caption" 
                  color="primary" 
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                  onClick={clearHistory}
                >
                  Clear
                </Typography>
              </Box>
              <List dense>
                {searchHistory.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleSuggestionClick(item)}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          )}

          {/* Popular Searches */}
          {!searchQuery && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  POPULAR SEARCHES
                </Typography>
              </Box>
              <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {popularSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    size="small"
                    icon={<TrendingUpIcon />}
                    onClick={() => handleSuggestionClick(search)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </>
          )}
        </SuggestionsDropdown>
      )}
    </SearchContainer>
  );
}