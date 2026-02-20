'use client'

import * as React from 'react'
import { useState } from 'react'
import { addMeal, getMeals, deleteMeal } from '@/actions/meals'
import { estimateNutrition } from '@/actions/estimate-nutrition'
import { searchFoodItems } from '@/actions/search-food'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Wand2, Search, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useDebounce } from 'use-debounce';

export function NutritionForm() {
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [meals, setMeals] = useState<any[]>([])

    // Autocomplete State
    const [showResults, setShowResults] = useState(false)
    const [foodDesc, setFoodDesc] = useState('')
    const [debouncedSearchTerm] = useDebounce(foodDesc, 300)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [searchResults, setSearchResults] = useState<any[]>([])

    // Form States
    const [calories, setCalories] = useState<string>('')
    const [protein, setProtein] = useState<string>('')
    const [carbs, setCarbs] = useState<string>('')
    const [fat, setFat] = useState<string>('')

    // Fetch meals on date change
    React.useEffect(() => {
        const loadMeals = async () => {
            const data = await getMeals(date)
            setMeals(data || [])
        }
        loadMeals()
    }, [date])

    // Search foods
    React.useEffect(() => {
        const fetchFoods = async () => {
            if (debouncedSearchTerm.length < 2) {
                setSearchResults([])
                setShowResults(false)
                return
            }
            const results = await searchFoodItems(debouncedSearchTerm)
            setSearchResults(results || [])
            setShowResults(true)
        }
        fetchFoods()
    }, [debouncedSearchTerm])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectFood = (item: any) => {
        setFoodDesc(item.name)
        setCalories(item.calories?.toString() || '0')
        setProtein(item.protein?.toString() || '0')
        setCarbs(item.carbs?.toString() || '0')
        setFat(item.fat?.toString() || '0')
        setShowResults(false)
        toast.success(`Selected: ${item.name}`)
    }

    const handleAutoFill = async () => {
        if (!foodDesc) {
            toast.error('Please enter a food description first')
            return
        }

        setAiLoading(true)
        const result = await estimateNutrition(foodDesc)
        setAiLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else if (result.data) {
            setCalories(result.data.calories?.toString() || '')
            setProtein(result.data.protein?.toString() || '')
            setCarbs(result.data.carbs?.toString() || '')
            setFat(result.data.fat?.toString() || '')
            toast.success('AI Estimations loaded!')
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        // We append the controlled 'name' (foodDesc) since it might not be in the form input if we use the combobox
        formData.set('name', foodDesc)
        formData.set('date', date)

        const result = await addMeal(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Meal added!')
            // Reset fields but keep date
            setFoodDesc('')
            setShowResults(false)
            setCalories('')
            setProtein('')
            setCarbs('')
            setFat('')
            // Refresh meals
            const updatedMeals = await getMeals(date)
            setMeals(updatedMeals || [])
        }
    }

    const handleDelete = async (id: number) => {
        const result = await deleteMeal(id)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Meal deleted')
            // Refresh meals
            const updatedMeals = await getMeals(date)
            setMeals(updatedMeals || [])
        }
    }

    // Calculations
    const totalCalories = meals.reduce((acc, curr) => acc + (curr.calories || 0), 0)
    const totalProtein = meals.reduce((acc, curr) => acc + (curr.protein || 0), 0)
    const totalCarbs = meals.reduce((acc, curr) => acc + (curr.carbs || 0), 0)
    const totalFat = meals.reduce((acc, curr) => acc + (curr.fat || 0), 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Section: Cols 4/12 */}
            <Card className="lg:col-span-4 lg:col-start-1">
                <CardHeader>
                    <CardTitle>Add Meal</CardTitle>
                    <CardDescription>Search database or use AI for estimation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date-nut">Date</Label>
                            <Input
                                type="date"
                                id="date-nut"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Food Name</Label>
                            <div className="flex gap-2 relative z-20">
                                <div className="relative flex-1">
                                    <div className="relative w-full">
                                        <Input
                                            placeholder="Search food (e.g., 'Yumurta')"
                                            value={foodDesc}
                                            onChange={(e) => {
                                                setFoodDesc(e.target.value)
                                                if (e.target.value.length === 0) setShowResults(false)
                                            }}
                                            onFocus={() => {
                                                if (searchResults.length > 0) setShowResults(true)
                                            }}
                                            // Delay hiding logic to allow clicking list items
                                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                            className="w-full pr-10"
                                            autoComplete="off"
                                        />
                                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>

                                    {/* Custom Autocomplete Dropdown */}
                                    {showResults && searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full mt-1 bg-popover border rounded-md shadow-md max-h-[300px] overflow-auto z-50">
                                            <div className="p-1">
                                                {searchResults.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                                        onClick={() => handleSelectFood(item)}
                                                    >
                                                        {/* Only name shown as requested */}
                                                        <span className="font-medium">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {showResults && searchResults.length === 0 && debouncedSearchTerm.length > 1 && (
                                        <div className="absolute top-full left-0 w-full mt-1 bg-popover border rounded-md shadow-md p-4 text-center text-sm z-50">
                                            No food found in DB.
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAutoFill}
                                    disabled={aiLoading}
                                    title="Estimate remaining with AI"
                                >
                                    <Wand2 className={`h-4 w-4 ${aiLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calories">Calories (kcal)</Label>
                            <Input
                                type="number"
                                id="calories"
                                name="calories"
                                placeholder="0"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="protein">Protein (g)</Label>
                                <Input
                                    type="number"
                                    id="protein"
                                    name="protein"
                                    placeholder="0"
                                    value={protein}
                                    onChange={(e) => setProtein(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="carbs">Carbs (g)</Label>
                                <Input
                                    type="number"
                                    id="carbs"
                                    name="carbs"
                                    placeholder="0"
                                    value={carbs}
                                    onChange={(e) => setCarbs(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fat">Fat (g)</Label>
                                <Input
                                    type="number"
                                    id="fat"
                                    name="fat"
                                    placeholder="0"
                                    value={fat}
                                    onChange={(e) => setFat(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Adding Order...' : 'Add Meal'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Table Section: Cols 8/12 */}
            <Card className="lg:col-span-8">
                <CardHeader>
                    <CardTitle>Meals for {date}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of your daily meals.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Name</TableHead>
                                <TableHead>Kcal</TableHead>
                                <TableHead>Prot</TableHead>
                                <TableHead>Carb</TableHead>
                                <TableHead>Fat</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No meals logged for this day.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                meals.map((meal) => (
                                    <TableRow key={meal.id}>
                                        <TableCell className="font-medium">{meal.name}</TableCell>
                                        <TableCell>{meal.calories}</TableCell>
                                        <TableCell>{meal.protein}g</TableCell>
                                        <TableCell>{meal.carbs}g</TableCell>
                                        <TableCell>{meal.fat}g</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(meal.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell>{totalCalories}</TableCell>
                                <TableCell>{totalProtein}g</TableCell>
                                <TableCell>{totalCarbs}g</TableCell>
                                <TableCell>{totalFat}g</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
