import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { Gallery } from "../galleryDisplay";
import { act } from "react-dom/test-utils";



const mockMediaContent = {
    type: "gallery",
    gallery_data: [
        {src: 'image1.jpg'},
        {src: 'image2.jpg'},
        {src: 'image3.jpg'}
    ]
}

it("renders the first image initially", () => {
    render(<Gallery mediaContent={mockMediaContent} />);

    const image = screen.getByAltText("Gallery");

    expect(image.src).toContain(mockMediaContent.gallery_data[0].src);
});

it("renders the next image when the > button is clicked", () => {
    render(<Gallery mediaContent={mockMediaContent} />);

    const nextButton = screen.getByLabelText("Next Slide");
    
    act(() => {
        userEvent.click(nextButton);
    });
    
    const image = screen.getByAltText("Gallery");

    expect(image.src).toContain(mockMediaContent.gallery_data[1].src);
});

it("renders the previous image when the < button is clicked", () => {
    render(<Gallery mediaContent={mockMediaContent} />);

    const nextButton = screen.getByLabelText("Next Slide");

    act(() => {
        userEvent.click(nextButton);
    })

    const previousButton = screen.getByLabelText("Previous Slide");

    act(() => {
        userEvent.click(previousButton);
    })

    const image = screen.getByAltText("Gallery");

    expect(image.src).toContain(mockMediaContent.gallery_data[0].src);
})