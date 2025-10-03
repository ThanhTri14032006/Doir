import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';

interface AdvancedSearchFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export function AdvancedSearchFilters({ onFilterChange }: AdvancedSearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState('all');

  const categories = ['Women', 'Men', 'Accessories', 'Bags', 'Shoes'];
  const colors = ['Black', 'White', 'Navy', 'Beige', 'Red', 'Gold'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleClearAll = () => {
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinRating(null);
    setAvailability('all');
  };

  const handleApplyFilters = () => {
    onFilterChange?.({
      priceRange,
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      minRating,
      availability
    });
  };

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 80, zIndex: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button size="small" onClick={handleClearAll}>Clear All</Button>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Categories
        </Typography>
        <FormGroup>
          {categories.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  size="small"
                />
              }
              label={cat}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={5000}
          step={100}
          sx={{ mt: 2 }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Colors */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Colors
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {colors.map((color) => (
            <Chip
              key={color}
              label={color}
              size="small"
              onClick={() => handleColorToggle(color)}
              color={selectedColors.includes(color) ? 'primary' : 'default'}
              variant={selectedColors.includes(color) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sizes */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Sizes
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {sizes.map((size) => (
            <Chip
              key={size}
              label={size}
              size="small"
              onClick={() => handleSizeToggle(size)}
              color={selectedSizes.includes(size) ? 'primary' : 'default'}
              variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Rating */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Minimum Rating
        </Typography>
        <Rating
          value={minRating}
          onChange={(_, newValue) => setMinRating(newValue)}
          sx={{ mt: 1 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Availability */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Availability
          </FormLabel>
          <RadioGroup value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <FormControlLabel value="all" control={<Radio size="small" />} label="All Products" />
            <FormControlLabel value="in_stock" control={<Radio size="small" />} label="In Stock" />
            <FormControlLabel value="on_sale" control={<Radio size="small" />} label="On Sale" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleApplyFilters}
        sx={{ mt: 2 }}
      >
        Apply Filters
      </Button>
    </Paper>
  );
}